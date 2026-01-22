import logging

from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import UserModel
from core.permissions import IsAdmin
from jobs.models.job import Job
from jobs.pagination import RecruiterJobPagination
from recruiter.models import RecruiterProfile

from .filters import AdminJobFilter
from .serializers import (
    AdminJobDetailSerializer,
    AdminJobListSerializer,
)
from .services import get_admin_stats_overview, get_top_candidates, get_top_recruiters, get_monthly_revenue_split


logger = logging.getLogger(__name__)


class AdminToggleBlockUserView(APIView):
    """
    PATCH /api/admin/users/<id>/block/
    Body: { "block": true | false }
    """

    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        logger.info("Admin block/unblock request", extra={"user_id": pk})

        try:
            user = UserModel.objects.get(pk=pk)
        except UserModel.DoesNotExist:
            logger.warning("User not found while blocking", extra={"user_id": pk})
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        block = request.data.get("block")

        if block is None:
            logger.warning(
                "`block` field missing in request",
                extra={"user_id": pk}
            )
            return Response(
                {"detail": "`block` field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.role == "admin":
            logger.warning(
                "Attempt to block admin user",
                extra={"user_id": user.id}
            )
            return Response(
                {"detail": "Admin users cannot be blocked"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user.is_blocked = bool(block)
        user.save(update_fields=["is_blocked"])

        logger.info(
            "User block status updated",
            extra={
                "user_id": user.id,
                "is_blocked": user.is_blocked,
            },
        )

        return Response(
            {
                "detail": "User blocked" if block else "User unblocked",
                "user_id": user.id,
                "is_blocked": user.is_blocked,
            },
            status=status.HTTP_200_OK,
        )


class AdminJobListView(generics.ListAPIView):
    serializer_class = AdminJobListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = RecruiterJobPagination
    queryset = Job.objects.all()

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
    ]

    filterset_class = AdminJobFilter

    ordering_fields = [
        "created_at",
        "published_at",
        "expires_at",
        "status",
        "recruiter__recruiter_profile__company_name",
        "recruiter__email",
    ]
    ordering = ["-created_at"]

    def list(self, request, *args, **kwargs):
        logger.info(
            "Admin job list requested",
            extra={"admin_id": request.user.id},
        )
        return super().list(request, *args, **kwargs)


class AdminJobDetailView(generics.RetrieveAPIView):
    """
    GET /api/admin/jobs/<id>/
    """

    serializer_class = AdminJobDetailSerializer
    permission_classes = [IsAdmin]
    queryset = Job.objects.all()

    def retrieve(self, request, *args, **kwargs):
        logger.info(
            "Admin job detail viewed",
            extra={
                "job_id": kwargs.get("pk"),
                "admin_id": request.user.id,
            },
        )
        return super().retrieve(request, *args, **kwargs)


class AdminRecruiterJobPostingView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        logger.info(
            "Admin recruiter posting permission update",
            extra={"recruiter_id": pk},
        )

        recruiter = get_object_or_404(RecruiterProfile, pk=pk)
        can_post = request.data.get("can_post_jobs")

        if can_post is None:
            logger.warning(
                "can_post_jobs missing in request",
                extra={"recruiter_id": pk},
            )
            return Response(
                {"detail": "can_post_jobs is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        recruiter.can_post_jobs = can_post
        recruiter.save(update_fields=["can_post_jobs"])

        logger.info(
            "Recruiter posting permission updated",
            extra={
                "recruiter_id": recruiter.id,
                "can_post_jobs": recruiter.can_post_jobs,
            },
        )

        return Response(
            {
                "id": recruiter.id,
                "can_post_jobs": recruiter.can_post_jobs,
            },
            status=status.HTTP_200_OK,
        )



class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        print(get_admin_stats_overview())
        logger.info(get_top_candidates())
        logger.info(get_top_recruiters())
        logger.info(f"{get_monthly_revenue_split()}")
        return Response({
            "metrics": {
                **get_admin_stats_overview(),
            },
            "jobseekers": get_top_candidates(),
            "recruiters": get_top_recruiters(),
            "revenue": get_monthly_revenue_split()
            # "notifications": get_admin_notifications(),
            # "quick_actions": get_quick_actions_data()
        })