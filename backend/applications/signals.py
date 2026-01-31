from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JobApplication
from embeddings.tasks import compute_job_match_task


@receiver(post_save, sender=JobApplication)
def trigger_match_score(sender, instance, created, **kwargs):
    if created:
        compute_job_match_task.delay(instance.id)
