from django_filters import rest_framework as filters
from django.utils import timezone
from datetime import timedelta
from jobs.models.job import Job


class RecruiterJobFilter(filters.FilterSet):
    status = filters.CharFilter(field_name="status")
    job_type = filters.CharFilter(field_name="job_type")
    work_mode = filters.CharFilter(field_name="work_mode")

    class Meta:
        model = Job
        fields = ["status", "job_type", "work_mode"]




class PublicJobFilter(filters.FilterSet):
    recruiter_id = filters.NumberFilter(field_name="recruiter_id")

    job_type = filters.CharFilter(field_name="job_type", lookup_expr="iexact")
    work_mode = filters.CharFilter(field_name="work_mode", lookup_expr="iexact")
    experience_level = filters.CharFilter(
        field_name="experience_level", lookup_expr="iexact"
    )

    location_city = filters.CharFilter(
        field_name="location_city", lookup_expr="iexact"
    )
    location_state = filters.CharFilter(
        field_name="location_state", lookup_expr="iexact"
    )
    location_country = filters.CharFilter(
        field_name="location_country", lookup_expr="iexact"
    )

    # Date filters
    published_after = filters.DateFilter(
        field_name="published_at", lookup_expr="date__gte"
    )
    published_before = filters.DateFilter(
        field_name="published_at", lookup_expr="date__lte"
    )
    posted_within = filters.NumberFilter(method="filter_posted_within")
    

    # Salary filters
    salary_min = filters.NumberFilter(method="filter_salary_min")
    salary_max = filters.NumberFilter(method="filter_salary_max")

    def filter_posted_within(self, queryset, name, value):
        cutoff = timezone.now() - timedelta(days=int(value))
        return queryset.filter(published_at__gte=cutoff)

    def filter_salary_min(self, queryset, name, value):
        return queryset.filter(salary_max__gte=value).exclude(salary_max__isnull=True)

    def filter_salary_max(self, queryset, name, value):
        return queryset.filter(salary_min__lte=value)

    class Meta:
        model = Job
        fields = [
            "recruiter_id",
            "job_type",
            "work_mode",
            "experience_level",
            "location_city",
            "location_state",
            "location_country",
            "published_after",
            "published_before",
            "salary_min",
            "salary_max",
        ]
