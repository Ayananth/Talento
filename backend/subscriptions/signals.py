import logging

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction

from subscriptions.models import UserSubscription
from subscriptions.usecases import notify_admins_new_subscription

logger = logging.getLogger(__name__)


@receiver(
    post_save,
    sender=UserSubscription,
    dispatch_uid="notify_admin_new_subscription"
)
def notify_new_subscription_signal(sender, instance, created, **kwargs):
    if not created:
        return

    logger.info("New subscription created: %s", instance.id)

    transaction.on_commit(
        lambda: notify_admins_new_subscription(instance)
    )
