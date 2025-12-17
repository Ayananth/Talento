import django_filters
from jobs.models.job import Job


class AdminJobFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status")
    job_type = django_filters.CharFilter(field_name="job_type")
    work_mode = django_filters.CharFilter(field_name="work_mode")

    class Meta:
        model = Job
        fields = ["status", "job_type", "work_mode"]
