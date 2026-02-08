from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsNotBlocked

from .models import Notification
from .serializers import NotificationSerializer


class UserNotificationListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return (
            Notification.objects.filter(user_id=self.request.user)
            .order_by("-created_at")
        )
