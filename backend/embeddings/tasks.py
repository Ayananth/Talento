from celery import shared_task
from django.db import transaction
import time
import logging

from jobs.models import Job
from embeddings.models import JobEmbedding
from embeddings.services import generate_embedding, build_job_text

logger = logging.getLogger(__name__)


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
        "Embedding task started",
        extra={"job_id": job_id, "attempt": attempt},
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
            "Embedding task completed",
            extra={
                "job_id": job_id,
                "attempt": attempt,
                "duration_sec": duration,
            },
        )

    except Job.DoesNotExist:
        logger.warning(
            "Embedding skipped — job deleted",
            extra={"job_id": job_id},
        )
        return

    except Exception as e:
        duration = round(time.time() - start_time, 2)

        logger.error(
            "Embedding task failed",
            extra={
                "job_id": job_id,
                "attempt": attempt,
                "duration_sec": duration,
                "error": str(e),
            },
        )
        raise
