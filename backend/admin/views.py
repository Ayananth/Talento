from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.permissions import IsAdmin
from authentication.models import UserModel
from rest_framework import generics
from .serializers import AdminJobListSerializer,AdminJobDetailSerializer
from jobs.pagination import RecruiterJobPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .filters import AdminJobFilter
from rest_framework.permissions import IsAuthenticated
from jobs.models.job import Job



class AdminToggleBlockUserView(APIView):
    """
    PATCH /api/admin/users/<id>/block/
    Body: { "block": true | false }
    """

    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            user = UserModel.objects.get(pk=pk)
        except UserModel.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        block = request.data.get("block")

        if block is None:
            return Response(
                {"detail": "`block` field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_blocked = bool(block)
        user.save(update_fields=["is_blocked"])

        return Response(
            {
                "detail": "User blocked" if block else "User unblocked",
                "user_id": user.id,
                "is_blocked": user.is_blocked,
            },
            status=status.HTTP_200_OK,
        )





# Job management
class AdminJobListView(generics.ListAPIView):
    serializer_class = AdminJobListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = RecruiterJobPagination
    queryset = Job.objects.all()

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = AdminJobFilter
    ordering_fields = ["created_at", "published_at"]
    ordering = ["-created_at"]

class AdminJobDetailView(generics.RetrieveAPIView):
    """
    GET /api/admin/jobs/<id>/
    """
    serializer_class = AdminJobDetailSerializer
    permission_classes = [IsAdmin]
    queryset = Job.objects.all()


