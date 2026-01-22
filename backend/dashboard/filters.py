import django_filters
from jobs.models.job import Job


class AdminJobFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status")

    company = django_filters.CharFilter(
        field_name="recruiter__recruiter_profile__company_name",
        lookup_expr="icontains"
    )

    class Meta:
        model = Job
        fields = ["status", "company"]
