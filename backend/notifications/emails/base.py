from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def send_email(*, to, subject, text_body, html_body):

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to],
    )

    if html_body:
        email.attach_alternative(html_body, "text/html")

    email.send(fail_silently=False)
