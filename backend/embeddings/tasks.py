from celery import shared_task
from django.db import transaction
import time
import logging
import os

from jobs.models.job import Job
from profiles.models import JobSeekerResume
from embeddings.models import JobEmbedding, ResumeEmbedding
from embeddings.services import generate_embedding, build_job_text
from embeddings.resume_parser import extract_text_from_pdf, parse_resume_with_ai, build_candidate_text

logger = logging.getLogger(__name__)

import requests




@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=30,
    retry_kwargs={"max_retries": 5},
)
def generate_job_embedding_task(self, job_id):
    start_time = time.time()
    attempt = self.request.retries + 1

    logger.info(
        f"Embedding task started | job_id={job_id} attempt={attempt}"
    )

    try:
        job = Job.objects.get(id=job_id)

        text = build_job_text(job)

        vector = generate_embedding(text)

        with transaction.atomic():
            JobEmbedding.objects.update_or_create(
                job=job,
                defaults={"embedding": vector},
            )

        duration = round(time.time() - start_time, 2)

        logger.info(
            f"Embedding task completed | job_id={job_id} attempt={attempt} duration_sec={duration}"
        )

    except Job.DoesNotExist:
        logger.warning(
            f"Embedding skipped — job deleted | job_id={job_id}"
        )
        return

    except Exception as e:
        duration = round(time.time() - start_time, 2)

        logger.error(
            f"Embedding task failed | job_id={job_id} attempt={attempt} duration_sec={duration} error={e}"
        )
        raise




def download_resume_to_temp(resume):
    url = resume.file.url

    logger.info(f"Downloading resume from {url}")

    response = requests.get(url, timeout=30)
    response.raise_for_status()

    import tempfile
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp.write(response.content)
    tmp.close()

    logger.info(f"Resume downloaded to {tmp.name}")

    return tmp.name


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=30,
    retry_kwargs={"max_retries": 3},
)
def generate_resume_embedding_task(self, resume_id):
    start_time = time.time()
    attempt = self.request.retries + 1

    logger.info(
        f"[START] Resume embedding | resume_id={resume_id} | attempt={attempt}"
    )

    try:
        resume = JobSeekerResume.objects.get(id=resume_id)

        temp_path = download_resume_to_temp(resume)

        try:
            logger.info(f"Extracting text | resume_id={resume_id}")
            raw_text = extract_text_from_pdf(temp_path)

            logger.info(f"Parsing resume with AI | resume_id={resume_id}")
            parsed = parse_resume_with_ai(raw_text)

            resume.parsed_data = parsed
            resume.save(update_fields=["parsed_data"])

            text = build_candidate_text(parsed)

            logger.info(f"Generating embedding | resume_id={resume_id}")
            vector = generate_embedding(text)

            with transaction.atomic():
                ResumeEmbedding.objects.update_or_create(
                    resume=resume,
                    defaults={"embedding": vector},
                )

            duration = round(time.time() - start_time, 2)

            logger.info(
                f"[SUCCESS] Resume embedding completed | resume_id={resume_id} | "
                f"attempt={attempt} | duration={duration}s"
            )

        finally:
            os.remove(temp_path)
            logger.info(f"Temp file cleaned | {temp_path}")

    except JobSeekerResume.DoesNotExist:
        logger.warning(
            f"[SKIP] Resume deleted before processing | resume_id={resume_id}"
        )
        return

    except Exception as e:
        duration = round(time.time() - start_time, 2)

        logger.error(
            f"[FAILED] Resume embedding | resume_id={resume_id} | "
            f"attempt={attempt} | duration={duration}s | error={str(e)}"
        )
        raise

    
from applications.models import JobApplication
from pgvector.django import CosineDistance


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=30,
    retry_kwargs={"max_retries": 5},
)
def compute_job_match_task(self, application_id):

    app = JobApplication.objects.get(id=application_id)

    try:
        job_embedding = JobEmbedding.objects.get(job=app.job).embedding
    except JobEmbedding.DoesNotExist:
        logger.warning(f"Job embedding missing | job_id={app.job_id}")
        raise Exception("Job embedding not ready")

    try:
        qs = (
            ResumeEmbedding.objects
            .filter(resume__profile=app.applicant)
            .annotate(
                distance=CosineDistance("embedding", job_embedding)
            )
            .values_list("distance", flat=True)
        )
        score = qs.first()
    except ResumeEmbedding.DoesNotExist:
        logger.warning(f"Resume embedding missing | applicant_id={app.applicant_id}")
        raise Exception("Resume embedding not ready")

    if score is None:
        raise Exception("No resume embedding found")

    similarity = 1 - score

    app.match_score = round(similarity * 100, 2)
    app.save(update_fields=["match_score"])

    logger.info(
        f"Match computed | application_id={application_id} | score={app.match_score}"
    )