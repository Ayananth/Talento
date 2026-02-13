import logging
import json

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

from applications.models import JobApplication, ApplicationInsight
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


from embeddings.services import generate_application_insight


class ApplicationInsightAPIView(APIView):

    def get(self, request, application_id):

        try:
            application = JobApplication.objects.select_related(
                "job", "applicant"
            ).get(id=application_id)
        except JobApplication.DoesNotExist:
            return Response(
                {"error": "Application not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if hasattr(application, "insight"):
            insight = application.insight
            return Response({
                "strengths": insight.strengths,
                "gaps": insight.gaps,
                "summary": insight.summary,
            })

        resume = application.applied_resume

        if not resume:
            return Response({"error": "No resume linked to application"}, status=400)

        embedding = resume.embedding

        if not embedding or not embedding.source_text:
            return Response({"error": "Resume not processed yet"}, status=400)

        parsed_data = resume.parsed_data  

        result = generate_application_insight(
            application.job,
            parsed_data
        )

        logger.info(f"{result=}")

        insight, _ = ApplicationInsight.objects.update_or_create(
            application=application,
            defaults={
                "strengths": result.get("strengths", ""),
                "gaps": result.get("gaps", ""),
                "summary": result.get("summary", ""),
            }
        )


        return Response({
            "strengths": insight.strengths,
            "gaps": insight.gaps,
            "summary": insight.summary,
        })


class ApplyJobView(APIView):
    permission_classes = [IsJobseeker]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        logger.info(
            "Job application attempt",
            extra={"jobseeker_id": request.user.id},
        )

        profile = request.user.jobseeker_profile

        resume_file = request.FILES.get("resume")
        resume_id = request.data.get("resume_id")

        applied_resume = None
        uploaded_asset = None

        try:
            #  User selected existing resume
            if resume_id:
                applied_resume = JobSeekerResume.objects.get(
                    id=resume_id,
                    profile=profile
                )

                # Optional snapshot copy (your existing behavior)
                uploaded_asset = uploader.upload(
                    applied_resume.file.url,
                    resource_type="image",
                    folder="talento-dev/resumes/applications"
                )

            # User uploaded new resume
            elif resume_file:
                # Create resume entry first (this triggers parsing + embedding via Celery)
                applied_resume = JobSeekerResume.objects.create(
                    profile=profile,
                    title=resume_file.name,
                    file=resume_file,
                )

                uploaded_asset = uploader.upload(
                    resume_file,
                    resource_type="image",
                    folder="talento-dev/resumes/applications"
                )

            else:
                return Response(
                    {"resume": ["Resume is required."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except JobSeekerResume.DoesNotExist:
            return Response(
                {"resume": ["Invalid resume selected"]},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as exception:
            logger.exception(f"Resume handling failed, {exception=}")
            return Response(
                {"detail": "Failed to process resume"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        parsed_snapshot = request.data.get("parsed_data_snapshot")
        if isinstance(parsed_snapshot, str) and parsed_snapshot.strip():
            try:
                parsed_snapshot = json.loads(parsed_snapshot)
            except json.JSONDecodeError:
                parsed_snapshot = None

        if not isinstance(parsed_snapshot, dict):
            parsed_snapshot = None

        request_data = request.data.copy()
        if "parsed_data_snapshot" in request_data:
            request_data.pop("parsed_data_snapshot")

        # Create application
        serializer = ApplyJobSerializer(
            data=request_data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        application = serializer.save(
            applicant=profile,
            applied_resume=applied_resume,
            resume=uploaded_asset["public_id"] if uploaded_asset else None,
            parsed_data_snapshot=parsed_snapshot,
        )

        logger.info(
            "Job application created",
            extra={
                "application_id": application.id,
                "resume_id": applied_resume.id,
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
        "match_score"
    ]
    ordering = ["-applied_at"]

    def get_queryset(self):
        logger.info(
            "Recruiter applications list requested",
            extra={"recruiter_id": self.request.user.id},
        )

        return (
            JobApplication.objects.filter(
                job__recruiter=self.request.user.recruiter_profile
            )
            .select_related(
                "job",
                "job__recruiter",
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
            job__recruiter=request.user.recruiter_profile,
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
                "applicant",
                "applicant__user",
            ).get(
                id=application_id,
                job__recruiter=request.user.recruiter_profile
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
                job__recruiter=request.user.recruiter_profile
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
