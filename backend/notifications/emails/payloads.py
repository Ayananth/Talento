import logging

from django.utils import timezone

logger = logging.getLogger(__name__)



def build_recruiter_approval_email(admin, recruiter_profile):
    """
    Returns a normalized email payload for recruiter approval request.
    """

    pending = recruiter_profile.pending_data or {}

    logger.info(
        "Building recruiter approval email",
        extra={
            "recruiter_profile_id": recruiter_profile.id,
            "pending_data_keys": list(pending.keys()),
        },
    )

    return {
        "to": admin.email,
        "subject": "New recruiter approval request",
        "template": "recruiter_approval_request",
        "context": {
            "company_name": pending.get("company_name"),
            "recruiter_email": recruiter_profile.user.email,
            "recruiter_name": recruiter_profile.user.get_username(),
            "industry": pending.get("industry"),
            "submitted_at": timezone.localtime(
                recruiter_profile.updated_at
            ),
            "admin_review_url": f"/admin/recruiters/{recruiter_profile.id}/",
            "year": timezone.now().year,
        },
    }
