from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsNotBlocked

from .models import Notification
from .serializers import NotificationSerializer


class UserNotificationListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["type", "is_read"]
    search_fields = ["title", "message"]
    ordering_fields = ["created_at", "is_read"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationReadStatusAPIView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    def patch(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user,
            )
        except Notification.DoesNotExist:
            return Response(
                {"detail": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        is_read = request.data.get("is_read")
        if not isinstance(is_read, bool):
            return Response(
                {"is_read": ["This field is required and must be true or false."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        notification.is_read = is_read
        notification.save(update_fields=["is_read"])

        return Response(
            {
                "id": notification.id,
                "is_read": notification.is_read,
            },
            status=status.HTTP_200_OK,
        )


class MarkAllNotificationsReadAPIView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    def patch(self, request):
        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False,
        ).update(is_read=True)

        return Response(
            {"updated_count": updated_count},
            status=status.HTTP_200_OK,
        )
