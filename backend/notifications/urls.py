from django.urls import path

from .views import UserNotificationListAPIView

app_name = "notifications"

urlpatterns = [
    path("", UserNotificationListAPIView.as_view(), name="user-notifications"),
]
