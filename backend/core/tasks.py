from core.celery import app

@app.task
def test_celery_task():
    print("🎉 Celery task executed successfully!")
    return "Task Completed"


from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_verification_email(subject, message, recipient):
    send_mail(
        subject,
        message,
        None,  # DEFAULT_FROM_EMAIL
        [recipient],
        fail_silently=False
    )
