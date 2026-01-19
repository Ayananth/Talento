import logging

import cloudinary.uploader as uploader

from django.db.models import Count, Q
from django.utils.timezone import now
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.models import JobApplication
from core.permissions import IsJobseeker, IsRecruiter
from profiles.models import JobSeekerResume

from .filters import JobApplicationFilter
from .pagination import ApplicationPagination
from .serializers import (
    ApplyJobSerializer,
    JobApplicationListSerializer,
    JobApplicationSerializer,
    RecruiterApplicationDetailSerializer,
    RecruiterApplicationListSerializer,
    UpdateApplicationStatusSerializer,
)

logger = logging.getLogger(__name__)


class ApplyJobView(APIView):
    permission_classes = [IsJobseeker]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        logger.info(
            "Job application attempt",
            extra={"jobseeker_id": request.user.id},
        )

        resume_file = request.FILES.get("resume")
        resume_id = request.data.get("resume_id")

        uploaded_asset = None

        try:
            if resume_id:
                resume = JobSeekerResume.objects.get(
                    id=resume_id,
                    profile=request.user.jobseeker_profile
                )

                uploaded_asset = uploader.upload(
                    resume.file.url,
                    resource_type="image",
                    folder="talento-dev/resumes/applications"
                )

            elif resume_file:
                uploaded_asset = uploader.upload(
                    resume_file,
                    resource_type="image",
                    folder="talento-dev/resumes/applications"
                )
            else:
                logger.warning(
                    "Resume missing in job application",
                    extra={"jobseeker_id": request.user.id},
                )
                return Response(
                    {"resume": ["Resume is required."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception:
            logger.exception(
                "Resume upload failed",
                extra={"jobseeker_id": request.user.id},
            )
            return Response(
                {"detail": "Failed to upload resume"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        serializer = ApplyJobSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        application = serializer.save(
            applicant=request.user.jobseeker_profile,
            resume=uploaded_asset["public_id"]
        )

        logger.info(
            "Job application created",
            extra={
                "application_id": application.id,
                "jobseeker_id": request.user.id,
            },
        )

        return Response(
            JobApplicationSerializer(application).data,
            status=status.HTTP_201_CREATED
        )

class MyApplicationsView(ListAPIView):
    permission_classes = [IsJobseeker]
    serializer_class = JobApplicationListSerializer
    pagination_class = ApplicationPagination

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
    ]

    filterset_class = JobApplicationFilter

    ordering_fields = [
        "applied_at",
        "updated_at",
        "status",
    ]
    ordering = ["-applied_at"]

    def get_queryset(self):
        logger.info(
            "Jobseeker applications list requested",
            extra={"jobseeker_id": self.request.user.id},
        )

        return (
            self.request.user.jobseeker_profile.applications
            .select_related(
                "job",
                "job__recruiter",
                "job__recruiter__recruiter_profile",
            )
        )

class JobApplicationsForRecruiterView(ListAPIView):
    permission_classes = [IsRecruiter]
    serializer_class = RecruiterApplicationListSerializer
    pagination_class = ApplicationPagination

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
    ]

    filterset_class = JobApplicationFilter

    ordering_fields = [
        "applied_at",
        "updated_at",
        "status",
    ]
    ordering = ["-applied_at"]

    def get_queryset(self):
        logger.info(
            "Recruiter applications list requested",
            extra={"recruiter_id": self.request.user.id},
        )

        return (
            JobApplication.objects.filter(
                job__recruiter=self.request.user
            )
            .select_related(
                "job",
                "job__recruiter",
                "job__recruiter__recruiter_profile",
                "applicant",
                "applicant__user",
            )
        )
class RecruiterApplicationStatsView(APIView):
    permission_classes = [IsRecruiter]

    def get(self, request):
        logger.info(
            "Recruiter application stats requested",
            extra={"recruiter_id": request.user.id},
        )

        base_qs = JobApplication.objects.filter(
            job__recruiter=request.user,
            job__is_active=True,
        ).filter(
            Q(job__expires_at__isnull=True) |
            Q(job__expires_at__gte=now())
        )

        stats = base_qs.aggregate(
            total_active=Count("id"),
            under_review=Count("id", filter=Q(status=JobApplication.Status.APPLIED)),
            shortlisted=Count("id", filter=Q(status=JobApplication.Status.SHORTLISTED)),
            interviewed=Count("id", filter=Q(status=JobApplication.Status.INTERVIEW)),
        )

        return Response(stats)
class ApplicationtDetailView(APIView):
    permission_classes = [IsRecruiter]

    def get(self, request, application_id):
        logger.info(
            "Recruiter application detail requested",
            extra={
                "application_id": application_id,
                "recruiter_id": request.user.id,
            },
        )

        try:
            application = JobApplication.objects.select_related(
                "job",
                "job__recruiter",
                "job__recruiter__recruiter_profile",
                "applicant",
                "applicant__user",
            ).get(
                id=application_id,
                job__recruiter=request.user
            )
        except JobApplication.DoesNotExist:
            logger.warning(
                "Application not found",
                extra={"application_id": application_id},
            )
            return Response(
                {"detail": "Application not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RecruiterApplicationDetailSerializer(application)
        return Response(serializer.data)
class UpdateApplicationStatusView(APIView):
    permission_classes = [IsRecruiter]

    def patch(self, request, application_id):
        logger.info(
            "Update application status requested",
            extra={
                "application_id": application_id,
                "recruiter_id": request.user.id,
            },
        )

        try:
            application = JobApplication.objects.get(
                id=application_id,
                job__recruiter=request.user
            )
        except JobApplication.DoesNotExist:
            logger.warning(
                "Application not found while updating status",
                extra={"application_id": application_id},
            )
            return Response(
                {"detail": "Application not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status")
        recruiter_notes = request.data.get("recruiter_notes", "")

        if new_status not in dict(JobApplication.Status.choices):
            logger.warning(
                "Invalid application status",
                extra={
                    "application_id": application_id,
                    "status": new_status,
                },
            )
            return Response(
                {"status": ["Invalid status."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.recruiter_notes = recruiter_notes
        application.save()

        logger.info(
            "Application status updated",
            extra={
                "application_id": application.id,
                "new_status": new_status,
            },
        )

        return Response(
            UpdateApplicationStatusSerializer(application).data,
            status=status.HTTP_200_OK
        )
