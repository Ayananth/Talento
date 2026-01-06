import cloudinary.uploader as uploader

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from core.permissions import IsJobseeker, IsRecruiter
from applications.models import JobApplication
from profiles.models import JobSeekerResume
from .serializers import ApplyJobSerializer, JobApplicationSerializer, JobApplicationListSerializer, RecruiterApplicationListSerializer, RecruiterApplicationDetailSerializer

from .pagination import ApplicationPagination
from .filters import JobApplicationFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from django.utils.timezone import now
from django.db.models import Count, Q


class ApplyJobView(APIView):
    permission_classes = [IsJobseeker]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        resume_file = request.FILES.get("resume")
        resume_id = request.data.get("resume_id")

        uploaded_asset = None

        if resume_id:
            resume = JobSeekerResume.objects.get(
                id=resume_id,
                profile=request.user.jobseeker_profile
            )

            uploaded_asset = uploader.upload(
                resume.file.url,                     # delivery URL
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
            return Response(
                {"resume": ["Resume is required."]},
                status=status.HTTP_400_BAD_REQUEST
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
        base_qs = JobApplication.objects.filter(
            job__recruiter=request.user,
            job__is_active=True,
        ).filter(
            Q(job__expires_at__isnull=True) |
            Q(job__expires_at__gte=now())
        )

        stats = base_qs.aggregate(
            total_active=Count("id"),

            under_review=Count(
                "id",
                filter=Q(status=JobApplication.Status.APPLIED)
            ),

            shortlisted=Count(
                "id",
                filter=Q(status=JobApplication.Status.SHORTLISTED)
            ),

            interviewed=Count(
                "id",
                filter=Q(status=JobApplication.Status.INTERVIEW)
            ),
        )

        return Response(stats)
    

class ApplicationtDetailView(APIView):
    permission_classes = [IsRecruiter]

    def get(self, request, application_id):
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
            return Response(
                {"detail": "Application not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RecruiterApplicationDetailSerializer(application)
        return Response(serializer.data)
