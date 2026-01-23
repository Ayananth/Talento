import django_filters
from jobs.models.job import Job

from subscriptions.models import UserSubscription


class TransactionFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(
        field_name="created_at", lookup_expr="gte"
    )
    end_date = django_filters.DateFilter(
        field_name="created_at", lookup_expr="lte"
    )
    plan_type = django_filters.CharFilter(
        field_name="plan__plan_type"
    )
    user_id = django_filters.NumberFilter(
        field_name="user__id"
    )

    class Meta:
        model = UserSubscription
        fields = [
            "plan_type",
            "status",
        ]


class AdminJobFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status")

    company = django_filters.CharFilter(
        field_name="recruiter__recruiter_profile__company_name",
        lookup_expr="icontains"
    )

    class Meta:
        model = Job
        fields = ["status", "company"]
