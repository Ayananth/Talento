import logging
from celery import shared_task
from django.utils import timezone
from django.db import transaction

from subscriptions.models import UserSubscription
from notifications.services import bulk_create_notifications
from notifications.choices import TypeChoices, RoleChoices

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 60},
)
def expire_subscriptions(self):
    now = timezone.now()

    subscriptions = list(
        UserSubscription.objects.filter(
            status="active",
            end_date__lt=now
        ).select_related("user")
    )

    if not subscriptions:
        logger.info("No subscriptions to expire")
        return "No subscriptions expired"

    subscription_ids = [s.id for s in subscriptions]

    with transaction.atomic():
        updated = UserSubscription.objects.filter(
            id__in=subscription_ids,
            status="active"
        ).update(status="expired")

    logger.info("Expired %s subscriptions", updated)

    notification_data = [
        {
            "user": sub.user,
            "user_role": sub.user.role,
            "title": "Subscription Expired",
            "message": "Your subscription has expired. Renew to continue premium access.",
            "type": TypeChoices.SUBSCRIPTION_END,
            "related_id": sub.id,
        }
        for sub in subscriptions
    ]

    try:
        bulk_create_notifications(notification_data)
    except Exception:
        logger.exception(
            "Failed to create subscription expiry notifications. "
            "subscription_ids=%s",
            subscription_ids
        )

    return f"Expired {updated} subscriptions"
