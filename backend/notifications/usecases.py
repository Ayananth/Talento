from authentication.services import get_admin_users
from notifications.services import bulk_create_notifications
from jobs.models.job import Job

def notify_admins_new_job(job_id: int):
    job = Job.objects.select_related("recruiter").get(id=job_id)

    admins = get_admin_users()

    data_list = [
        {
            "user": admin,
            "user_role": "admin",
            "title": "New Job Posted",
            "message": f"{job.recruiter.company_name} posted a new job",
            "type": "job_posted",
            "related_id": job.id,
        }
        for admin in admins
    ]

    if data_list:
        bulk_create_notifications(data_list)
