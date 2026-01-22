from django.utils.timezone import now
from django.db.models import Count, Sum, Q
from django.conf import settings
from django.contrib.auth import get_user_model
import logging
logger = logging.getLogger(__name__)

from django.db.models.functions import TruncMonth




from jobs.models.job import Job
from applications.models import JobApplication
from subscriptions.models import UserSubscription

User = get_user_model()


def get_admin_stats_overview():

    today = now().date()


    yearly_revenue = (
        UserSubscription.objects
        .filter(
            status="active",  # or "paid"
            created_at__year=today.year
        )
        .aggregate(
            revenue=Sum("plan__price")
        )["revenue"] or 0
    )

    monthly_revenue = (
        UserSubscription.objects
        .filter(
            status="active",
            created_at__year=today.year,
            created_at__month=today.month
        )
        .aggregate(
            revenue=Sum("plan__price")
        )["revenue"] or 0
    )


    return {
        "total_jobseekers": User.objects.filter(
            role="jobseeker",
            is_active=True
        ).count(),

        "total_recruiters": User.objects.filter(
            role="recruiter",
            is_active=True
        ).count(),

        "active_jobs": Job.objects.filter(
            status="published",
            is_active = True
        ).count(),

        "applications_today": JobApplication.objects.filter(
            applied_at__date=today
        ).count(),
        "revenue_year": yearly_revenue,
        "revenue__month": monthly_revenue,
    }



def get_top_candidates(limit=5):
    qs = (
        JobApplication.objects
        .filter(
            status__in=[
                JobApplication.Status.SHORTLISTED,
                JobApplication.Status.INTERVIEW,
                JobApplication.Status.HIRED,
            ]
        )
        .values(
            "applicant_id",
            "applicant__fullname",
            "applicant__headline",
            "applicant__profile_image",
        )
        .annotate(
            shortlist_count=Count("id")
        )
        .order_by("-shortlist_count")[:limit]
    )

    results = []
    for row in qs:
        profile_image = row["applicant__profile_image"]

        results.append({
            "applicant_id": row["applicant_id"],
            "fullname": row["applicant__fullname"],
            "headline": row["applicant__headline"],
            "profile_image": profile_image.url if profile_image else None,
            "shortlist_count": row["shortlist_count"],
        })

    return results

def get_top_recruiters(limit=5):
    logger.info(Job.objects.all())
    qs = (
        Job.objects.all()
        .values(
            "recruiter_id",
            "recruiter__company_name",
            "recruiter__logo",
            "recruiter__location",
        )       
        .annotate(
            job_count=Count("id")
        )
        .order_by("-job_count")[:limit]
    )

    results = []
    for row in qs:
        logo = row["recruiter__logo"]

        results.append({
            "recruiter_id": row["recruiter_id"],
            "company_name": row["recruiter__company_name"],
            "location": row["recruiter__location"],
            "logo": logo.url if logo else None,
            "job_count": row["job_count"],
        })

    return results





def get_monthly_revenue_split(year=None):
    if year is None:
        year = now().year

    qs = (
        UserSubscription.objects
        .filter(
            status="active",
            created_at__year=year
        )
        .annotate(month=TruncMonth("created_at"))
        .values("month", "plan__plan_type")
        .annotate(revenue=Sum("plan__price"))
        .order_by("month")
    )

    # Initialize all months
    months = {
        1: {"jobseeker": 0, "recruiter": 0},
        2: {"jobseeker": 0, "recruiter": 0},
        3: {"jobseeker": 0, "recruiter": 0},
        4: {"jobseeker": 0, "recruiter": 0},
        5: {"jobseeker": 0, "recruiter": 0},
        6: {"jobseeker": 0, "recruiter": 0},
        7: {"jobseeker": 0, "recruiter": 0},
        8: {"jobseeker": 0, "recruiter": 0},
        9: {"jobseeker": 0, "recruiter": 0},
        10: {"jobseeker": 0, "recruiter": 0},
        11: {"jobseeker": 0, "recruiter": 0},
        12: {"jobseeker": 0, "recruiter": 0},
    }

    for row in qs:
        month_num = row["month"].month
        plan_type = row["plan__plan_type"]
        months[month_num][plan_type] = row["revenue"] or 0

    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return [
        {
            "month": month_names[i - 1],
            "jobseeker": months[i]["jobseeker"],
            "recruiter": months[i]["recruiter"],
        }
        for i in range(1, 13)
    ]
