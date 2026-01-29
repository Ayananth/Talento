from django.db.models.signals import post_save
from django.dispatch import receiver

from jobs.models.job import Job
from embeddings.tasks import generate_job_embedding_task


@receiver(post_save, sender=Job)
def trigger_embedding(sender, instance, created, **kwargs):
    generate_job_embedding_task.delay(instance.id)
