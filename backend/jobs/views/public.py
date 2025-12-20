from django.utils import timezone
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.exceptions import NotFound
from django.db.models import F


from jobs.models.job import Job
from jobs.serializers import PublicJobListSerializer, PublicJobDetailSerializer
from jobs.filters import PublicJobFilter
from jobs.pagination import RecruiterJobPagination


class PublicJobListView(ListAPIView):
    print("public job list view")
    serializer_class = PublicJobListSerializer
    pagination_class = RecruiterJobPagination

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
        SearchFilter,
    ]

    filterset_class = PublicJobFilter
    search_fields = ["title", "description"]
    ordering_fields = ["published_at"]
    ordering = ["-published_at"]

    def get_queryset(self):
        print("get query set")
        print(Job.objects.filter(
            status=Job.Status.PUBLISHED,
            is_active=True
        ))
        return Job.objects.filter(
            status=Job.Status.PUBLISHED,
            is_active=True,
        )
    




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
