from django.utils import timezone
from .models import UserSubscription

def get_active_subscription(user):
    return UserSubscription.objects.filter(
        user=user,
        status="active",
        end_date__gt=timezone.now()
    ).order_by("-end_date").first()


def user_has_active_subscription(user):
    return get_active_subscription(user) is not None
