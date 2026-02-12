# notifications/usecases/job_match_notifications.py

import logging
from authentication.services import get_admin_users
from notifications.services import bulk_create_notifications
from notifications.choices import TypeChoices, RoleChoices

logger = logging.getLogger(__name__)


def notify_job_match_sent(user, job, similarity):
    admins = get_admin_users()

    similarity_pct = round(similarity * 100, 1)

    data_list = [
        #  Candidate notification
        {
            "user": user,
            "user_role": RoleChoices.JOBSEEKER,
            "title": "New Job Match Found",
            "message": (
                f"A job matching your profile ({similarity_pct}% match) "
                f"is available: {job.title}"
            ),
            "type": TypeChoices.JOB_MATCH_FOUND,
            "related_id": job.id,
        }
    ]

    #  Admin notifications
    for admin in admins:
        data_list.append(
            {
                "user": admin,
                "user_role": RoleChoices.ADMIN,
                "title": "Job Match Email Sent",
                "message": (
                    f"Job match email sent to {user.email} "
                    f"for job '{job.title}' ({similarity_pct}% match)."
                ),
                "type": TypeChoices.JOB_MATCH_SENT,
                "related_id": job.id,
            }
        )

    try:
        bulk_create_notifications(data_list)
    except Exception:
        logger.exception(
            "Failed to create job match notifications | job_id=%s user_id=%s",
            job.id,
            user.id
        )
