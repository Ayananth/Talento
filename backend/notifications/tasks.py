from celery import shared_task
from notifications.service import notify_admin
from notifications.recruiter_service import notify_recruiter
from notifications.events import NotificationEvent


@shared_task(
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 30},
)
def notify_admin_task(event, payload):
    """
    Async wrapper for admin notifications.
    """
    notify_admin(event=event, payload=payload)



@shared_task(
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 30},
)
def notify_recruiter_task(event, payload):
    notify_recruiter(event=event, payload=payload)
