from celery import shared_task
from django.utils import timezone

from subscriptions.models import UserSubscription
from notifications.services import bulk_create_notifications


@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3, "countdown": 60})
def expire_subscriptions(self):
    now = timezone.now()

    subscriptions = list(
        UserSubscription.objects.filter(
            status="active",
            end_date__lt=now
        ).select_related("user")
    )

    if not subscriptions:
        return "No subscriptions expired"

    UserSubscription.objects.filter(
        id__in=[s.id for s in subscriptions]
    ).update(status="expired")

    notification_data = [
        {
            "user": sub.user,
            "user_role": sub.user.role,
            "title": "Subscription Expired",
            "message": "Your subscription has expired. Renew to continue premium access.",
            "type": "SubscriptionExpired",
            "related_id": sub.id
        }
        for sub in subscriptions
    ]

    bulk_create_notifications(notification_data)

    return f"Expired {len(subscriptions)} subscriptions"
