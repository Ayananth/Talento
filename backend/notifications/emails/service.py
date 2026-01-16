from notifications.emails.base import send_email
from notifications.emails.renderer import render_email


def send_email_from_payload(payload):
    """
    Sends an email using a normalized email payload.
    """

    text_body, html_body = render_email(
        template_name=payload["template"],
        context=payload["context"],
    )

    send_email(
        to=payload["to"],
        subject=payload["subject"],
        text_body=text_body,
        html_body=html_body,
    )
