import logging

from django.utils import timezone

import os

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
            "admin_review_url": f"{os.getenv('FRONTEND_URL')}/admin/recruiter/approvals/{recruiter_profile.id}/",
            "year": timezone.now().year,
        },
    }




def build_recruiter_approved_email(recruiter_profile):
    return {
        "to": recruiter_profile.user.email,
        "subject": "Your recruiter profile has been approved",
        "template": "recruiter_approved",
        "context": {
            "company_name": recruiter_profile.company_name,
            "recruiter_name": recruiter_profile.user.get_username(),
            "dashboard_url": f"{os.getenv('FRONTEND_URL')}/recruiter/dashboard/",
            "year": timezone.now().year,
        },
    }


def build_recruiter_rejected_email(recruiter_profile):
    return {
        "to": recruiter_profile.user.email,
        "subject": "Your recruiter profile needs changes",
        "template": "recruiter_rejected",
        "context": {
            "company_name": (
                recruiter_profile.pending_data or {}
            ).get("company_name"),
            "rejection_reason": recruiter_profile.rejection_reason,
            "resubmit_url": f"{os.getenv('FRONTEND_URL')}/recruiter/profile/",
            "year": timezone.now().year,
        },
    }

