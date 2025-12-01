from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from datetime import datetime

@shared_task(bind=True, max_retries=3)
def send_verification_email(self, user_email, verify_url):
    try:
        html_content = render_to_string(
            "authentication/email_verification.html",
            {
                "user_email": user_email,
                "verify_url": verify_url,
                "year": datetime.now().year,
            },
        )

        subject = "Verify your Talento account"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [user_email]

        email = EmailMultiAlternatives(
            subject=subject,
            body="Please verify your account using the link provided.",
            from_email=from_email,
            to=to,
        )
        email.attach_alternative(html_content, "text/html")
        email.send()

        return "Email sent successfully"

    except Exception as exc:
        # Retry after 10 seconds
        raise self.retry(exc=exc, countdown=10)
