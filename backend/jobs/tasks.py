import logging
from celery import shared_task
from django.utils import timezone
from django.db import transaction

from jobs.models.job import Job
from notifications.services import bulk_create_notifications

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 60},
)
def expire_jobs(self):
    now = timezone.now()

    jobs = list(
        Job.objects.filter(
            status=Job.Status.PUBLISHED,
            expires_at__lt=now,
            is_active=True,
        ).select_related("recruiter__user")
    )

    if not jobs:
        logger.info("No jobs to expire")
        return "No jobs expired"

    job_ids = [job.id for job in jobs]

    with transaction.atomic():
        updated = Job.objects.filter(
            id__in=job_ids,
            status=Job.Status.PUBLISHED
        ).update(
            status=Job.Status.CLOSED,
            is_active=False
        )

    logger.info("Expired %s jobs", updated)

    notification_data = [
        {
            "user": job.recruiter.user,
            "user_role": "recruiter",
            "title": "Job Expired",
            "message": (
                f"Your job posting '{job.title}' has expired. "
                f"You can repost or extend it from your dashboard."
            ),
            "type": "job_expired",
            "related_id": job.id,
        }
        for job in jobs
        if job.recruiter and job.recruiter.user
    ]

    try:
        if notification_data:
            bulk_create_notifications(notification_data)
    except Exception:
        logger.exception(
            "Failed to create job expiry notifications. job_ids=%s",
            job_ids
        )

    return f"Expired {updated} jobs"
