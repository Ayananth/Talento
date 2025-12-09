from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone

from .models import RecruiterProfile
from .serializers import RecruiterDraftCreateSerializer
from core.permissions import IsRecruiter, IsAdmin



class RecruiterProfileDraftCreateView(generics.GenericAPIView):
    """
    POST /api/recruiter/profile/draft/create/

    - Creates or overwrites the draft for the logged-in recruiter.
    - Stores text fields in `pending_data`
    - Stores files in `draft_logo` / `draft_business_registration_doc`
    - Sets status = 'pending'
    """

    serializer_class = RecruiterDraftCreateSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        profile, _ = RecruiterProfile.objects.get_or_create(user=user)

        data = serializer.validated_data.copy()

        draft_logo = data.pop("draft_logo", None)
        draft_doc = data.pop("draft_business_registration_doc", None)

        profile.pending_data = data

        if draft_logo is not None:
            profile.draft_logo = draft_logo

        if draft_doc is not None:
            profile.draft_business_registration_doc = draft_doc

        profile.status = "pending"
        profile.rejection_reason = ""
        profile.save()

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
    PATCH /api/recruiter/profile/draft/update/

    - Updates only parts of the draft.
    - Does NOT touch published fields.
    - Any update puts status back to "pending".
    """
    serializer_class = RecruiterDraftCreateSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    parser_classes = [MultiPartParser, FormParser]  # supports file upload

    def patch(self, request, *args, **kwargs):
        user = request.user
        profile = user.recruiter_profile

        if profile.pending_data is None:
            return Response(
                {"error": "No draft exists. Submit a draft first."},
                status=status.HTTP_400_BAD_REQUEST
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
    PATCH /api/admin/recruiter/profile/<pk>/approve/

    Admin approves the draft:
    - pending_data → published fields
    - draft files → live files
    - clear draft fields
    - status = "published"
    """

    permission_classes = [IsAdmin]
    queryset = RecruiterProfile.objects.all()

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()

        if not profile.pending_data and not profile.draft_logo and not profile.draft_business_registration_doc:
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

