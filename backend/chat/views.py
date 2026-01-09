from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404


from .models import Conversation, Message
from .serializers import ConversationListSerializer, MessageSerializer


class ConversationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        conversations = Conversation.objects.filter(
            Q(jobseeker=user) | Q(recruiter=user)
        ).select_related(
            "job", "jobseeker", "recruiter"
        ).prefetch_related(
            "messages"
        ).order_by("-created_at")

        serializer = ConversationListSerializer(
            conversations,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


class ConversationMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id
        )

        # Permission check (very important)
        if request.user not in [conversation.jobseeker, conversation.recruiter]:
            return Response({"detail": "Forbidden"}, status=403)

        messages = (
            Message.objects
            .filter(conversation=conversation)
            .select_related("sender")
            .order_by("created_at")
        )

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)