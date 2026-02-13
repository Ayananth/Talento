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
from subscriptions.models import UserSubscription

logger = logging.getLogger(__name__)


class RecruiterJobCreateView(CreateAPIView):
    serializer_class = RecruiterJobSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    NON_SUBSCRIBED_ACTIVE_JOB_LIMIT = 3

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
            raise ValidationError(
                {
                    "code": "JOB_POSTING_DISABLED",
                    "detail": "Job posting has been disabled by admin.",
                }
            )

        has_active_subscription = UserSubscription.objects.filter(
            user=self.request.user,
            status="active",
            end_date__gt=timezone.now(),
            plan__plan_type="recruiter",
        ).exists()

        if not has_active_subscription:
            active_jobs_count = Job.objects.filter(
                recruiter=recruiter_profile,
                is_active=True,
                status=Job.Status.PUBLISHED,
            ).count()

            if active_jobs_count >= self.NON_SUBSCRIBED_ACTIVE_JOB_LIMIT:
                logger.warning(
                    "Non-subscribed recruiter reached active job limit",
                    extra={
                        "recruiter_id": self.request.user.id,
                        "active_jobs_count": active_jobs_count,
                    },
                )
                raise ValidationError(
                    {
                        "code": "ACTIVE_JOB_LIMIT_REACHED",
                        "detail": (
                            "An active recruiter subscription is required to "
                            "post more than 3 active jobs."
                        ),
                    }
                )

        job_expiry_days = 45 if has_active_subscription else 15

        serializer.save(
            recruiter=self.request.user.recruiter_profile,
            status=Job.Status.PUBLISHED,
            published_at=timezone.now(),
            expires_at=timezone.now() + timedelta(days=job_expiry_days),
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
