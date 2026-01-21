# admin_dashboard/services/stats.py

from django.utils.timezone import now
from django.db.models import Count, Sum
from django.conf import settings
from django.contrib.auth import get_user_model


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
