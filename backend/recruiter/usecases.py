from authentication.services import get_admin_users
from notifications.services import bulk_create_notifications
from notifications.choices import TypeChoices, RoleChoices

import logging

logger = logging.getLogger(__name__)


def notify_admins_recruiter_pending_review(recruiter_profile):
    admins = get_admin_users()
    logger.info("Notifying admins about recruiter pending review. recruiter_profile_id=%s", recruiter_profile)


    data_list = [
        {
            "user": admin,
            "user_role": RoleChoices.ADMIN,
            "title": "Recruiter Approval Required",
            "message": (
                f"New Recruiter is waiting for approval."
            ),
            "type": TypeChoices.RECRUITER_ACTIONS,
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
            "user_role": RoleChoices.ADMIN,
            "title": "Recruiter Profile Edit Pending Approval",
            "message": (
                f"{company_name} has submitted profile changes "
                f"and is waiting for admin approval."
            ),
            "type": TypeChoices.RECRUITER_ACTIONS,
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


def notify_recruiter_approved(profile):
    user = profile.user
    company_name = profile.company_name or "Your company"

    data_list = [
        {
            "user": user,
            "user_role": RoleChoices.RECRUITER,
            "title": "Recruiter Profile Approved 🎉",
            "message": (
                f"Congratulations! {company_name} has been approved. "
                f"You can now post jobs and access recruiter features."
            ),
            "type": TypeChoices.ADMIN_ACTIONS,
            "related_id": profile.id,
        }
    ]

    try:
        bulk_create_notifications(data_list)
    except Exception:
        logger.exception(
            "Failed to notify recruiter about approval. "
            "recruiter_profile_id=%s",
            profile.id
        )


def notify_recruiter_rejected(profile):
    user = profile.user
    company_name = profile.company_name or "Your company"
    rejection_reason = profile.rejection_reason or "No reason provided."

    data_list = [
        {
            "user": user,
            "user_role": RoleChoices.RECRUITER,
            "title": "Recruiter Profile Rejected",
            "message": (
                f"Unfortunately, {company_name} was rejected. "
                f"Reason: {rejection_reason}"
            ),
            "type": TypeChoices.ADMIN_ACTIONS,
            "related_id": profile.id,
        }
    ]

    try:
        bulk_create_notifications(data_list)
    except Exception:
        logger.exception(
            "Failed to notify recruiter about rejection. "
            "recruiter_profile_id=%s",
            profile.id
        )
