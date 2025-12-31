import django_filters
from .models import RecruiterProfile
from django.db.models import Q


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

    request_type = django_filters.CharFilter(
        method="filter_request_type"
    )


    class Meta:
        model = RecruiterProfile
        fields = ["status", "company_name", "industry", "request_type"]

    def filter_request_type(self, queryset, name, value):
        value = value.lower()

        empty_company_data = (
            (Q(company_name__isnull=True) | Q(company_name="")) &
            (Q(website__isnull=True) | Q(website="")) &
            (Q(industry__isnull=True) | Q(industry=""))
        )

        if value == "new":
            return queryset.filter(empty_company_data)

        if value == "edit":
            return queryset.exclude(empty_company_data)

        return queryset