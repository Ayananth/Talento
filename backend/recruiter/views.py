import logging

from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import generics, status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdmin, IsRecruiter

from .filters import RecruiterProfileFilter
from .models import RecruiterProfile
from .serializers import (
    AdminRecruiterDetailSerializer,
    AdminRecruiterListSerializer,
    RecruiterDraftCreateSerializer,
    RecruiterProfileSerializer,
)

from django.db import transaction
from notifications.events import NotificationEvent
from notifications.service import notify_admin
from notifications.tasks import notify_admin_task


logger = logging.getLogger(__name__)


class RecruiterProfileDraftCreateView(generics.GenericAPIView):
    """
    POST /api/recruiter/profile/draft/create/
    """

    serializer_class = RecruiterDraftCreateSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        logger.info(
            "Recruiter profile draft create requested",
            extra={"recruiter_id": request.user.id},
        )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile, _ = RecruiterProfile.objects.get_or_create(user=request.user)

        data = serializer.validated_data.copy()

        draft_logo = data.pop("draft_logo", None)
        draft_doc = data.pop("draft_business_registration_doc", None)

        profile.pending_data = data

        if draft_logo is not None:
            profile.draft_logo = draft_logo

        if draft_doc is not None:
            profile.draft_business_registration_doc = draft_doc

        profile.status = "pending"
        profile.rejection_reason = None
        profile.save()

        profile_id = profile.id

        if profile.is_first_submission():
            transaction.on_commit(
                lambda pid=profile_id: notify_admin_task.delay(
                    event=NotificationEvent.RECRUITER_APPROVAL_REQUESTED,
                    payload={"recruiter_profile_id": pid}
                )
            )



        logger.info(
            "Recruiter profile draft created",
            extra={
                "recruiter_id": request.user.id,
                "status": profile.status,
            },
        )

        return Response(
            {
                "detail": "Recruiter company profile draft submitted for review.",
                "status": profile.status,
                "pending_data": profile.pending_data,
            },
            status=status.HTTP_201_CREATED,
        )


class RecruiterProfileDraftUpdateView(generics.GenericAPIView):
    """
    PATCH recruiter draft
    """

    serializer_class = RecruiterDraftCreateSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        profile = request.user.recruiter_profile

        logger.info(
            "Recruiter profile draft update requested",
            extra={"recruiter_id": request.user.id},
        )

        if profile.pending_data is None:
            logger.warning(
                "Recruiter attempted draft update without existing draft",
                extra={"recruiter_id": request.user.id},
            )
            return Response(
                {"error": "No draft exists. Submit a draft first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data.copy()

        draft_logo = data.pop("draft_logo", None)
        draft_doc = data.pop("draft_business_registration_doc", None)

        profile.pending_data.update(data)

        if draft_logo is not None:
            profile.draft_logo = draft_logo

        if draft_doc is not None:
            profile.draft_business_registration_doc = draft_doc

        profile.status = "pending"
        profile.rejection_reason = ""
        profile.save()

        logger.info(
            "Recruiter profile draft updated",
            extra={"recruiter_id": request.user.id},
        )

        return Response(
            {
                "detail": "Draft updated successfully.",
                "pending_data": profile.pending_data,
                "status": profile.status,
            },
            status=status.HTTP_200_OK,
        )


class AdminApproveRecruiterProfileView(generics.UpdateAPIView):
    """
    Admin approves recruiter draft
    """

    permission_classes = [IsAdmin]
    queryset = RecruiterProfile.objects.all()

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()

        logger.info(
            "Admin recruiter profile approval requested",
            extra={"profile_id": profile.id},
        )

        if (
            not profile.pending_data
            and not profile.draft_logo
            and not profile.draft_business_registration_doc
        ):
            logger.warning(
                "Admin attempted to approve recruiter without draft",
                extra={"profile_id": profile.id},
            )
            return Response(
                {"error": "No draft exists to approve."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if profile.pending_data:
            for field, value in profile.pending_data.items():
                if hasattr(profile, field):
                    setattr(profile, field, value)

        if profile.draft_logo:
            profile.logo = profile.draft_logo

        if profile.draft_business_registration_doc:
            profile.business_registration_doc = profile.draft_business_registration_doc

        profile.pending_data = None
        profile.draft_logo = None
        profile.draft_business_registration_doc = None

        profile.status = "published"
        profile.rejection_reason = ""
        profile.verified_at = timezone.now()
        profile.save()

        logger.info(
            "Recruiter profile approved",
            extra={"profile_id": profile.id},
        )

        return Response(
            {
                "detail": "Recruiter profile approved and published successfully.",
                "status": profile.status,
                "published_data": {
                    "company_name": profile.company_name,
                    "website": profile.website,
                    "industry": profile.industry,
                    "company_size": profile.company_size,
                    "about_company": profile.about_company,
                    "logo": str(profile.logo),
                    "business_registration_doc": str(profile.business_registration_doc),
                },
            },
            status=status.HTTP_200_OK,
        )


class AdminRejectRecruiterProfileView(generics.UpdateAPIView):
    """
    Admin rejects recruiter draft
    """

    permission_classes = [IsAdmin]
    queryset = RecruiterProfile.objects.all()

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()

        logger.info(
            "Admin recruiter profile rejection requested",
            extra={"profile_id": profile.id},
        )

        if (
            not profile.pending_data
            and not profile.draft_logo
            and not profile.draft_business_registration_doc
        ):
            logger.warning(
                "Admin attempted to reject recruiter without draft",
                extra={"profile_id": profile.id},
            )
            return Response(
                {"error": "No draft exists to reject."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = request.data.get("reason", "").strip()

        if not reason:
            return Response(
                {"error": "Rejection reason is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile.status = "rejected"
        profile.rejection_reason = reason
        profile.save()

        logger.info(
            "Recruiter profile rejected",
            extra={"profile_id": profile.id},
        )

        return Response(
            {
                "detail": "Draft rejected successfully.",
                "status": profile.status,
                "rejection_reason": profile.rejection_reason,
                "pending_data": profile.pending_data,
            },
            status=status.HTTP_200_OK,
        )






class AdminRecruiterListView(generics.ListAPIView):

    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = RecruiterProfile.objects.all()
    serializer_class = AdminRecruiterListSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = RecruiterProfileFilter
    search_fields = ["company_name", "industry", "user__email"]
    ordering_fields = ["created_at", "company_name", "status"]

    def get_queryset(self):
        return RecruiterProfile.objects.filter(status="pending")

    def list(self, request, *args, **kwargs):
        paginated_response = super().list(request, *args, **kwargs)
        return Response({
            "count": paginated_response.data.get("count"),
            "next": paginated_response.data.get("next"),
            "previous": paginated_response.data.get("previous"),
            "results": paginated_response.data.get("results"),
        })


class AdminRecruiterProfileDetailView(generics.RetrieveAPIView):
    """
    Admin view to fetch full details of a recruiter
    """

    serializer_class = AdminRecruiterDetailSerializer
    queryset = RecruiterProfile.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin]


class BaseAdminRecruiterListView(generics.ListAPIView):
    """
    Shared base for recruiter admin lists
    """

    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AdminRecruiterListSerializer
    queryset = RecruiterProfile.objects.all()

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = RecruiterProfileFilter

    search_fields = ["company_name", "industry", "user__email"]
    ordering_fields = ["updated_at", "company_name", "status", "user__username"]

    def list(self, request, *args, **kwargs):
        logger.info(
            "Admin recruiter list requested",
            extra={"admin_id": request.user.id},
        )

        paginated_response = super().list(request, *args, **kwargs)
        return Response(
            {
                "count": paginated_response.data.get("count"),
                "next": paginated_response.data.get("next"),
                "previous": paginated_response.data.get("previous"),
                "results": paginated_response.data.get("results"),
            }
        )


class AdminRecruiterListView(BaseAdminRecruiterListView):
    queryset = RecruiterProfile.objects.all()


class PendingRecruiterListView(BaseAdminRecruiterListView):
    def get_queryset(self):
        return RecruiterProfile.objects.filter(
            status="pending"
        ).order_by("-updated_at")


class AdminRecruiterProfileDetailView(generics.RetrieveAPIView):
    serializer_class = AdminRecruiterDetailSerializer
    queryset = RecruiterProfile.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin]


class RecruiterProfileDetailView(generics.RetrieveAPIView):
    serializer_class = RecruiterProfileSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request, *args, **kwargs):
        logger.info(
            "Recruiter profile detail requested",
            extra={"recruiter_id": request.user.id},
        )

        try:
            profile = request.user.recruiter_profile
        except RecruiterProfile.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)