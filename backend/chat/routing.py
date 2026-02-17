# chat/routing.py
from django.urls import re_path
from .consumers import ChatConsumer
from .consumers_user import UserNotificationConsumer

websocket_urlpatterns = [
    # re_path(r"ws/chat/$", ChatConsumer.as_asgi()),
    re_path(
        r"ws/chat/(?P<conversation_id>\d+)/$",
        ChatConsumer.as_asgi(),
    ),

    re_path(r"ws/user/notifications/$", UserNotificationConsumer.as_asgi()),


]