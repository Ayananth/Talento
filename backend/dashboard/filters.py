import django_filters
from jobs.models.job import Job

from subscriptions.models import UserSubscription
from django.core.exceptions import ValidationError


class TransactionFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__gte"
    )
    to_date = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__lte"
    )

    status = django_filters.CharFilter(
        field_name="status"
    )

    plan_type = django_filters.CharFilter(
        field_name="plan__plan_type"
    )

    def clean(self):
        cleaned_data = super().clean()

        from_date = cleaned_data.get("from_date")
        to_date = cleaned_data.get("to_date")

        if from_date and to_date and from_date > to_date:
            raise ValidationError("from_date cannot be after to_date")

        return cleaned_data

    class Meta:
        model = UserSubscription
        fields = [
            "status",
            "plan_type",
            "from_date",
            "to_date",
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
