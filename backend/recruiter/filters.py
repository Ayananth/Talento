import django_filters
from .models import RecruiterProfile


class RecruiterProfileFilter(django_filters.FilterSet):
    """
    Admin can filter recruiter profiles by:
      - status
      - company_name
      - industry
      - user email
      - created_at range
    """

    company_name = django_filters.CharFilter(
        field_name="company_name",
        lookup_expr="icontains"
    )

    industry = django_filters.CharFilter(
        field_name="industry",
        lookup_expr="icontains"
    )

    email = django_filters.CharFilter(
        field_name="user__email",
        lookup_expr="icontains"
    )

    created_from = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="gte"
    )

    created_to = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="lte"
    )

    class Meta:
        model = RecruiterProfile
        fields = ["status", "company_name", "industry"]
