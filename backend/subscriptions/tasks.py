from celery import shared_task
from django.utils import timezone

from subscriptions.models import UserSubscription


@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3, "countdown": 60})
def expire_subscriptions(self):
    now = timezone.now()

    expired = UserSubscription.objects.filter(
        status="active",
        end_date__lt=now
    )

    count = expired.count()

    expired.update(status="expired")

    return f"Expired {count} subscriptions"
