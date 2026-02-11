import logging

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.db import transaction

from recruiter.models import RecruiterProfile
from recruiter.usecases import notify_admins_recruiter_pending_review, notify_admins_recruiter_edit_pending_review, notify_recruiter_approved, notify_recruiter_rejected

logger = logging.getLogger(__name__)


@receiver(
    post_save,
    sender=RecruiterProfile,
    dispatch_uid="notify_admin_recruiter_pending_review"
)
def notify_recruiter_pending_review_signal(sender, instance, created, **kwargs):
    if not created:
        return

    if not instance.is_pending_review():
        return

    logger.info(
        "Recruiter profile pending review: recruiter_profile_id=%s",
        instance.id
    )

    transaction.on_commit(
        lambda: notify_admins_recruiter_pending_review(instance)
    )


@receiver(
    pre_save,
    sender=RecruiterProfile,
    dispatch_uid="notify_admin_recruiter_edit_pending_review"
)
def notify_recruiter_edit_pending_review_signal(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        previous = RecruiterProfile.objects.get(pk=instance.pk)
    except RecruiterProfile.DoesNotExist:
        return

    status_changed_to_pending = (
        previous.status != "pending"
        and instance.status == "pending"
    )

    if not status_changed_to_pending:
        return

    if not instance.is_editing():
        return

    logger.info(
        "Recruiter profile edit pending review: recruiter_profile_id=%s",
        instance.id
    )

    transaction.on_commit(
        lambda: notify_admins_recruiter_edit_pending_review(instance)
    )



@receiver(
    pre_save,
    sender=RecruiterProfile,
    dispatch_uid="notify_recruiter_on_status_change"
)
def notify_recruiter_on_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        previous = RecruiterProfile.objects.get(pk=instance.pk)
    except RecruiterProfile.DoesNotExist:
        return

    if previous.status == instance.status:
        return

    logger.info(
        "Recruiter status changed: recruiter_profile_id=%s, %s → %s",
        instance.id,
        previous.status,
        instance.status,
    )

    if instance.status == "approved":
        transaction.on_commit(
            lambda: notify_recruiter_approved(instance)
        )

    elif instance.status == "rejected":
        transaction.on_commit(
            lambda: notify_recruiter_rejected(instance)
        )