from authentication.services import get_admin_users
from notifications.services import bulk_create_notifications

import logging

logger = logging.getLogger(__name__)


def notify_admins_recruiter_pending_review(recruiter_profile):
    admins = get_admin_users()

    user = recruiter_profile.user
    company_name = recruiter_profile.pending_data.company_name or "New Recruiter"

    data_list = [
        {
            "user": admin,
            "user_role": "admin",
            "title": "Recruiter Approval Required",
            "message": (
                f"{company_name} has registered as a recruiter "
                f"and is waiting for approval."
            ),
            "type": "NewRecruite",
            "related_id": recruiter_profile.id,
        }
        for admin in admins
    ]

    if data_list:
        try:
            bulk_create_notifications(data_list)
        except Exception:
            logger.exception(
                "Failed to create admin notifications for recruiter pending review. "
                "recruiter_profile_id=%s",
                recruiter_profile.id
            )



def notify_admins_recruiter_edit_pending_review(recruiter_profile):
    admins = get_admin_users()

    if not admins:
        logger.warning(
            "No admins found for recruiter edit review. "
            "recruiter_profile_id=%s",
            recruiter_profile.id
        )
        return

    company_name = recruiter_profile.company_name or "Recruiter"

    data_list = [
        {
            "user": admin,
            "user_role": "admin",
            "title": "Recruiter Profile Edit Pending Approval",
            "message": (
                f"{company_name} has submitted profile changes "
                f"and is waiting for admin approval."
            ),
            "type": "RecruiterEditProfile",
            "related_id": recruiter_profile.id,
        }
        for admin in admins
    ]

    try:
        bulk_create_notifications(data_list)
    except Exception:
        logger.exception(
            "Failed to notify admins for recruiter edit pending review. "
            "recruiter_profile_id=%s",
            recruiter_profile.id
        )
