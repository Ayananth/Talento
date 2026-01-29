from celery import shared_task
from django.db import transaction

from jobs.models.job import Job
from embeddings.models import JobEmbedding
from embeddings.services import generate_embedding, build_job_text

import logging
import time

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=30,
    retry_kwargs={"max_retries": 3},
)
def generate_job_embedding_task(self, job_id):
    try:
        job = Job.objects.get(id=job_id)

        text = build_job_text(job)

        vector = generate_embedding(text)

        with transaction.atomic():
            JobEmbedding.objects.update_or_create(
                job=job,
                defaults={"embedding": vector},
            )

    except Job.DoesNotExist:
        return
