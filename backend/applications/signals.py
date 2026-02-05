import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JobApplication
from embeddings.tasks import compute_job_match_task
from django.db import transaction

from notifications.services import create_notification


logger = logging.getLogger(__name__)

@receiver(post_save, sender=JobApplication)
def trigger_match_score(sender, instance, created, **kwargs):
    if created:
        transaction.on_commit(
            lambda: compute_job_match_task.delay(instance.id)
        )


@receiver(post_save, sender=JobApplication)
def notify_new_application_signal(sender, instance, created, **kwargs):
    if created:
        logger.info("New job application created", extra={"id": instance.id})

        create_notification(
            user=instance.applicant.user,
            user_role="jobseeker",
            title="New Job Application",
            message=f"{instance.applicant.fullname} applied for {instance.job.title}",
            type="JobApplication",
            related_id=instance.pk
        )

@receiver(post_save, sender=JobApplication)
def notify_status_change_signal(sender, instance, created, **kwargs):
    if created:
        return
    if instance._previous_status != instance.status:
        create_notification(
            user=instance.applicant.user,
            user_role="jobseeker",
            title="Application Status Changed",
            message=f"Application status changed to {instance.status} for {instance.job.title}",
            type="StatusChange",
            related_id=instance.pk
        )


        
        
