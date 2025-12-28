from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
    SearchVector,
    TrigramSimilarity
    )

from django.db.models import Q


from django.utils import timezone
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.exceptions import NotFound
from django.db.models import F
from django.db.models.functions import Coalesce


from jobs.models.job import Job
from jobs.serializers import PublicJobListSerializer, PublicJobDetailSerializer
from jobs.filters import PublicJobFilter
from jobs.pagination import RecruiterJobPagination

class PublicJobListView(ListAPIView):
    serializer_class = PublicJobListSerializer
    pagination_class = RecruiterJobPagination

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PublicJobFilter

    ordering_fields = [
        "published_at",
        "salary_sort",
    ]
    ordering = ["-published_at"]

    def get_queryset(self):
        ordering_param = self.request.query_params.get("ordering")
        search = self.request.query_params.get("search")

        queryset = Job.objects.filter(
            status=Job.Status.PUBLISHED,
            is_active=True,
        ).annotate(
            salary_sort=Coalesce("salary_max", "salary_min", 0)
        )

        if search:
            query = SearchQuery(search, search_type="websearch")

            queryset = queryset.annotate(
                rank=SearchRank("search_vector", query),
                similarity=TrigramSimilarity("title", search),
            ).filter(
                Q(rank__gt=0.01) | Q(similarity__gt=0.2)
            )

            if not ordering_param:
                queryset = queryset.order_by(
                    "-rank", "-similarity", "-published_at"
                )

        return queryset

class PublicJobDetailView(RetrieveAPIView):
    serializer_class = PublicJobDetailSerializer
    queryset = Job.objects.all()

    def get_object(self):
        job = super().get_object()

        if job.status != Job.Status.PUBLISHED or not job.is_active:
            raise NotFound("Job not found")

        if job.expires_at and job.expires_at <= timezone.now():
            raise NotFound("Job expired")

        # Increment view count safely
        Job.objects.filter(id=job.id).update(
            view_count=F("view_count") + 1
        )

        return job
