from django.urls import path

from .views import (
    MarkAllNotificationsReadAPIView,
    NotificationReadStatusAPIView,
    UserNotificationListAPIView,
)

app_name = "notifications"

urlpatterns = [
    path("", UserNotificationListAPIView.as_view(), name="user-notifications"),
    path(
        "<int:notification_id>/read-status/",
        NotificationReadStatusAPIView.as_view(),
        name="notification-read-status",
    ),
    path(
        "mark-all-read/",
        MarkAllNotificationsReadAPIView.as_view(),
        name="mark-all-notifications-read",
    ),
]
