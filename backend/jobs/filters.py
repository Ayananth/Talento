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
    job_type = django_filters.CharFilter(field_name="job_type")
    work_mode = django_filters.CharFilter(field_name="work_mode")
    experience_level = django_filters.CharFilter(field_name="experience_level")
    location_country = django_filters.CharFilter(field_name="location_country")

    class Meta:
        model = Job
        fields = [
            "job_type",
            "work_mode",
            "experience_level",
            "location_country",
        ]

