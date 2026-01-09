from django.urls import path
from . import views


app_name = "chat"

urlpatterns = [
    path("conversations/", views.ConversationListAPIView.as_view(), name="conversation-list"),
    # path("conversations/<int:pk>/", views.ConversationDetailView.as_view(), name="conversation-detail"),
    path("conversations/<int:conversation_id>/messages/", views.ConversationMessagesAPIView.as_view(), name="message-list"),
    # path("conversations/<int:pk>/messages/send/", views.SendMessageView.as_view(), name="send-message"),
    path("conversations/start/", views.StartConversationAPIView.as_view()),
]