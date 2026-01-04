import django_filters
from .models import JobApplication

class JobApplicationFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")

    class Meta:
        model = JobApplication
        fields = ["status"]
