from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Conversation
from .serializers import ConversationListSerializer


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
