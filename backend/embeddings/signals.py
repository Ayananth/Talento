from django.db.models.signals import post_save
from django.dispatch import receiver

from jobs.models.job import Job
from profiles.models import JobSeekerResume
from embeddings.models import JobEmbedding
from embeddings.tasks import generate_job_embedding_task, generate_resume_embedding_task, notify_matching_candidates_task
import logging

logger = logging.getLogger(__name__)


# @receiver(post_save, sender=JobEmbedding)
# def trigger_matching_on_job_embedding(sender, instance, created, **kwargs):
#     logger.info("signal triggered for instant job search")
#     job_id = instance.job_id
#     logger.info(f"Job embedding ready — triggering match | job_id={job_id}")
#     notify_matching_candidates_task.delay(job_id)


# @receiver(post_save, sender=Job)
# def trigger_embedding(sender, instance, created, **kwargs):
#     generate_job_embedding_task.delay(instance.id)


# @receiver(post_save, sender=JobSeekerResume)
# def trigger_resume_embedding(sender, instance, created, **kwargs):
#     if created:
#         generate_resume_embedding_task.delay(instance.id)
