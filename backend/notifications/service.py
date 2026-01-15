import logging

from django.contrib.auth import get_user_model
from notifications.events import NotificationEvent

User = get_user_model()
logger = logging.getLogger(__name__)



from recruiter.models import RecruiterProfile
from notifications.emails.payloads import build_recruiter_approval_email


from notifications.emails.service import send_email_from_payload

def _notify_single_admin(admin, event, payload):
    if event == NotificationEvent.RECRUITER_APPROVAL_REQUESTED:
        recruiter_profile_id = payload["recruiter_profile_id"]

        recruiter_profile = RecruiterProfile.objects.get(
            id=recruiter_profile_id
        )

        logger.info(f"{recruiter_profile=}")

        email_payload = build_recruiter_approval_email(
            admin=admin,
            recruiter_profile=recruiter_profile,
        )

        send_email_from_payload(email_payload)



def _handle_recruiter_approval_requested(payload):
    """
    Recruiter has submitted profile for approval.
    Notify all superusers.
    """

    recruiter_profile_id = payload.get("recruiter_profile_id")
    if not recruiter_profile_id:
        return

    admins = User.objects.filter(is_superuser=True, is_active=True)

    for admin in admins:
        _notify_single_admin(
            admin=admin,
            event=NotificationEvent.RECRUITER_APPROVAL_REQUESTED,
            payload=payload,
        )


def notify_admin(event, payload):
    """
    Entry point for admin notifications.
    Decides *who* to notify for a given business event.
    """

    if event == NotificationEvent.RECRUITER_APPROVAL_REQUESTED:
        _handle_recruiter_approval_requested(payload)
    else:
        # Unknown or unhandled event
        return





