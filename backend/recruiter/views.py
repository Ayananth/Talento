from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import RecruiterProfile
from .serializers import RecruiterDraftCreateSerializer
from core.permissions import IsRecruiter 


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
