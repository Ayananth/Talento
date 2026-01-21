import logging
from datetime import timedelta

from django.core.exceptions import PermissionDenied
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdmin, IsRecruiter
from jobs.filters import RecruiterJobFilter
from jobs.models.job import Job
from jobs.pagination import RecruiterJobPagination
from jobs.serializers import (
    JobCloseSerializer,
    JobCreateSerializer,
    JobPublishSerializer,
    JobUpdateSerializer,
    RecruiterJobDetailSerializer,
    RecruiterJobListSerializer,
    RecruiterJobSerializer,
)

logger = logging.getLogger(__name__)


class RecruiterJobCreateView(CreateAPIView):
    serializer_class = RecruiterJobSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def perform_create(self, serializer):
        recruiter_profile = self.request.user.recruiter_profile

        logger.info(
            "Recruiter job create requested",
            extra={"recruiter_id": self.request.user.id},
        )

        if not recruiter_profile.can_post_jobs:
            logger.warning(
                "Job posting disabled for recruiter",
                extra={"recruiter_id": self.request.user.id},
            )
            return Response(
                {
                    "code": "JOB_POSTING_DISABLED",
                    "detail": "Job posting has been disabled by admin."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save(
            recruiter=self.request.user.recruiter_profile,
            status=Job.Status.PUBLISHED,
            published_at=timezone.now(),
            expires_at=timezone.now() + timedelta(days=90),
            is_active=True,
        )

        logger.info(
            "Recruiter job created",
            extra={"recruiter_id": self.request.user.id},
        )


class RecruiterJobUpdateView(UpdateAPIView):
    serializer_class = RecruiterJobSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    queryset = Job.objects.all()

    def get_queryset(self):
        return self.queryset.filter(recruiter=self.request.user.recruiter_profile)

    def perform_update(self, serializer):
        job = self.get_object()

        logger.info(
            "Recruiter job update requested",
            extra={
                "job_id": job.id,
                "recruiter_id": self.request.user.recruiter_profile.id,
            },
        )

        if not job.is_active or job.status == Job.Status.CLOSED:
            logger.warning(
                "Attempt to update closed job",
                extra={
                    "job_id": job.id,
                    "recruiter_id": self.request.user.id,
                },
            )
            raise ValidationError("Closed jobs cannot be edited.")

        serializer.save()

        logger.info(
            "Recruiter job updated",
            extra={"job_id": job.id},
        )


class RecruiterJobDetailView(RetrieveAPIView):
    serializer_class = RecruiterJobDetailSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        logger.info(
            "Recruiter job detail requested",
            extra={"recruiter_id": self.request.user.id},
        )
        return Job.objects.filter(recruiter=self.request.user.recruiter_profile)


class RecruiterJobDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]

    def delete(self, request, pk):
        logger.info(
            "Recruiter job delete requested",
            extra={
                "job_id": pk,
                "recruiter_id": request.user.id,
            },
        )

        job = get_object_or_404(
            Job,
            pk=pk,
            recruiter=request.user.recruiter_profile,
        )

        if not job.is_active or job.status == Job.Status.CLOSED:
            logger.warning(
                "Attempt to delete already closed job",
                extra={
                    "job_id": job.id,
                    "recruiter_id": request.user.id,
                },
            )
            return Response(
                {"detail": "Job is already closed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        job.is_active = False
        job.status = Job.Status.CLOSED
        job.save()

        logger.info(
            "Recruiter job closed",
            extra={"job_id": job.id},
        )

        return Response(status=status.HTTP_204_NO_CONTENT)


class RecruiterJobListView(ListAPIView):
    serializer_class = RecruiterJobListSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    pagination_class = RecruiterJobPagination

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = RecruiterJobFilter

    ordering_fields = [
        "expires_at",
        "view_count",
    ]
    ordering = ["-created_at"]

    def get_queryset(self):
        logger.info(
            "Recruiter job list requested",
            extra={"recruiter_id": self.request.user.recruiter_profile.id},
        )

        return (
            Job.objects
            .filter(recruiter=self.request.user.recruiter_profile)
            .annotate(applications_count=Count("applications"))
        )
