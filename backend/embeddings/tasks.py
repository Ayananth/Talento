from celery import shared_task
from django.db import transaction
import time
import logging

from jobs.models.job import Job
from profiles.models import JobSeekerResume
from embeddings.models import JobEmbedding, ResumeEmbedding
from embeddings.services import generate_embedding, build_job_text
from embeddings.resume_parser import extract_text_from_pdf, parse_resume_with_ai, build_candidate_text

logger = logging.getLogger(__name__)

import tempfile
import requests

def download_resume_to_temp(resume):
    url = resume.file.url 
    
    response = requests.get(url, timeout=30)
    response.raise_for_status()

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp.write(response.content)
    tmp.close()

    return tmp.name



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




@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=30,
    retry_kwargs={"max_retries": 3},
)
def generate_resume_embedding_task(self, resume_id):

    resume = JobSeekerResume.objects.get(id=resume_id)

    # 1. Download PDF locally if needed
    file_path = resume.file.path  

    # 2. Extract text
    raw_text = extract_text_from_pdf(file_path)

    # 3. Parse structured data
    parsed = parse_resume_with_ai(raw_text)

    resume.parsed_data = parsed
    resume.save(update_fields=["parsed_data"])

    # 4. Build embedding text
    text = build_candidate_text(parsed)

    # 5. Generate vector
    vector = generate_embedding(text)

    # 6. Upsert
    ResumeEmbedding.objects.update_or_create(
        resume=resume,
        defaults={"embedding": vector},
    )
