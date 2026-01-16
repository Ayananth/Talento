import logging

from recruiter.models import RecruiterProfile
from notifications.events import NotificationEvent
from notifications.emails.payloads import (
    build_recruiter_approved_email,
    build_recruiter_rejected_email,
)
from notifications.emails.service import send_email_from_payload

logger = logging.getLogger(__name__)


def notify_recruiter(event, payload):
    recruiter_profile_id = payload.get("recruiter_profile_id")
    if not recruiter_profile_id:
        return

    recruiter_profile = RecruiterProfile.objects.get(
        id=recruiter_profile_id
    )

    if event == NotificationEvent.RECRUITER_APPROVED:
        email_payload = build_recruiter_approved_email(
            recruiter_profile
        )

    elif event == NotificationEvent.RECRUITER_REJECTED:
        email_payload = build_recruiter_rejected_email(
            recruiter_profile
        )
    else:
        return

    send_email_from_payload(email_payload)
