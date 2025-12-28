import django_filters
from jobs.models.job import Job


class RecruiterJobFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status")
    job_type = django_filters.CharFilter(field_name="job_type")
    work_mode = django_filters.CharFilter(field_name="work_mode")

    class Meta:
        model = Job
        fields = ["status", "job_type", "work_mode"]




class PublicJobFilter(django_filters.FilterSet):
    job_type = django_filters.CharFilter(
        field_name="job_type",
        lookup_expr="iexact"
    )

    work_mode = django_filters.CharFilter(
        field_name="work_mode",
        lookup_expr="iexact"
    )

    experience_level = django_filters.CharFilter(
        field_name="experience_level",
        lookup_expr="iexact"
    )

    location_city = django_filters.CharFilter(
        field_name="location_city",
        lookup_expr="iexact"
    )

    location_state = django_filters.CharFilter(
        field_name="location_state",
        lookup_expr="iexact"
    )

    location_country = django_filters.CharFilter(
        field_name="location_country",
        lookup_expr="iexact"
    )

    class Meta:
        model = Job
        fields = [
            "job_type",
            "work_mode",
            "experience_level",
            "location_city",
            "location_state",
            "location_country",
        ]
