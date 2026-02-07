import logging

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction

from jobs.models.job import Job
from notifications.usecases import notify_admins_new_job

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Job, dispatch_uid="notify_admin_new_job")
def notify_new_job_signal(sender, instance, created, **kwargs):
    if not created:
        return

    transaction.on_commit(lambda: notify_admins_new_job(instance.id))
