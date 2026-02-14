import logging

from django.contrib.postgres.search import (
    SearchQuery,
    SearchRank,
    TrigramSimilarity,
)
from django.db.models import (
    BooleanField,
    Count,
    Exists,
    F,
    FloatField,
    OuterRef,
    Q,
    Value,
)
from django.db.models import ExpressionWrapper
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.exceptions import NotFound
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListAPIView, RetrieveAPIView

from applications.models import JobApplication
from jobs.filters import PublicJobFilter
from jobs.models.job import Job, SavedJob
from jobs.pagination import RecruiterJobPagination, Pagination
from jobs.serializers import (
    PublicJobDetailSerializer,
    PublicJobListSerializer,
    SavedJobListSerializer,
    SavedJobSerializer,
    TopRecruiterStatsSerializer
)
from core.permissions import IsJobseeker
from django.db import IntegrityError
from recruiter.models import RecruiterProfile
from embeddings.models import JobEmbedding, ResumeEmbedding
from pgvector.django import CosineDistance

logger = logging.getLogger(__name__)


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
        user = self.request.user

        logger.info(
            "Public job list requested",
            extra={
                "search": bool(search),
                "ordering": ordering_param,
                "user_authenticated": user.is_authenticated,
            },
        )

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
                    "-rank",
                    "-similarity",
                    "-published_at",
                )

        if user.is_authenticated and getattr(user, "role", None) == "jobseeker":
            queryset = queryset.annotate(
                has_applied=Exists(
                    JobApplication.objects.filter(
                        job=OuterRef("pk"),
                        applicant=user.jobseeker_profile,
                    )
                )
            )
        else:
            queryset = queryset.annotate(
                has_applied=Value(False, output_field=BooleanField())
            )

        return queryset




class PublicJobDetailView(RetrieveAPIView):
    serializer_class = PublicJobDetailSerializer

    def get_queryset(self):
        user = self.request.user

        logger.info(
            "Public job detail queryset requested",
            extra={
                "user_authenticated": user.is_authenticated,
            },
        )

        queryset = (
            Job.objects.filter(
                status=Job.Status.PUBLISHED,
                is_active=True,
            )
            .exclude(
                expires_at__isnull=False,
                expires_at__lte=timezone.now(),
            )
        )

        if user.is_authenticated and getattr(user, "role", None) == "jobseeker":
            queryset = queryset.annotate(
                has_applied=Exists(
                    JobApplication.objects.filter(
                        job=OuterRef("pk"),
                        applicant=user.jobseeker_profile,
                    )
                ),
                is_saved=Exists(
                    SavedJob.objects.filter(
                        job=OuterRef("pk"),
                        user=user,
                    )
                ),
            )
        else:
            queryset = queryset.annotate(
                has_applied=Value(False, output_field=BooleanField()),
                is_saved=Value(False, output_field=BooleanField()),
            )

        return queryset

    def get_object(self):
        job = super().get_object()

        Job.objects.filter(id=job.id).update(
            view_count=F("view_count") + 1
        )

        logger.info(
            "Public job viewed",
            extra={
                "job_id": job.id,
                "new_view_increment": True,
            },
        )

        return job



class PublicSavedJobsListView(ListAPIView):
    permission_classes = [IsJobseeker]
    serializer_class = SavedJobListSerializer
    pagination_class = Pagination

    ordering_fields = [
        "created_at"
    ]
    ordering = ["-created_at"]
    filter_backends = [OrderingFilter]


    def get_queryset(self):
        logger.info(
            "saved applications list requested",
            extra={"jobseeker_id": self.request.user.id},
        )
        return SavedJob.objects.filter(
        user=self.request.user,
        ).select_related(
            "job",
            "job__recruiter",
        )



class SaveJobView(APIView):
    permission_classes = [IsJobseeker]

    def post(self, request, job_id):
        user = request.user

        try:
            job = Job.objects.get(id=job_id, is_active=True, status="published")
        except Job.DoesNotExist:
            return Response(
                {"detail": "Job not found or not available."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            saved_job = SavedJob.objects.create(
                user=user,
                job=job
            )
        except IntegrityError:
            return Response(
                {"detail": "Job already saved."},
                status=status.HTTP_409_CONFLICT
            )

        serializer = SavedJobSerializer(saved_job)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class UnsaveJobView(APIView):
    permission_classes = [IsJobseeker]

    def delete(self, request, job_id):
        deleted, _ = SavedJob.objects.filter(
            user=request.user,
            job_id=job_id
        ).delete()

        if not deleted:
            return Response(
                {"detail": "Saved job not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(status=status.HTTP_204_NO_CONTENT)
    



class LandingPageStatsView(APIView):

    def get(self, request):
        top_recruiters = (
            RecruiterProfile.objects
            .annotate(job_count=Count("jobs"))
            .values(
                "id",
                "company_name",
                "location",
                "logo",
                "job_count",
            )
            .order_by("-job_count")[:5]
        )



        serializer = TopRecruiterStatsSerializer(top_recruiters, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class JobResumeSimilarityView(APIView):

    def post(self, request):
        user_id = request.data.get("user_id")
        job_id = request.data.get("job_id")

        if not user_id or not job_id:
            return Response(
                {"detail": "Both user_id and job_id are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            job_embedding = JobEmbedding.objects.get(job_id=job_id)
        except JobEmbedding.DoesNotExist:
            return Response(
                {"detail": "Job embedding not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        resume_embedding = (
            ResumeEmbedding.objects.filter(
                resume__profile__user_id=user_id,
                resume__is_default=True,
                resume__is_deleted=False,
            )
            .annotate(
                similarity=ExpressionWrapper(
                    1 - CosineDistance("embedding", job_embedding.embedding),
                    output_field=FloatField(),
                )
            )
            .first()
        )

        if not resume_embedding:
            return Response(
                {"detail": "Default resume embedding not found for this user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        similarity = float(resume_embedding.similarity)

        return Response(
            {
                "user_id": int(user_id),
                "job_id": int(job_id),
                "cosine_similarity": round(similarity, 6),
                "match_percent": round(similarity * 100, 2),
            },
            status=status.HTTP_200_OK,
        )
