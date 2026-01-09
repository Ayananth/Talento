from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404


from .models import Conversation, Message
from .serializers import ConversationListSerializer, MessageSerializer, StartConversationSerializer
from jobs.models.job import Job
from authentication.models import UserModel as User
from django.db import transaction
from rest_framework import status   


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
    

class StartConversationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StartConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        job_id = serializer.validated_data["job_id"]
        recipient_id = serializer.validated_data["recipient_id"]
        content = serializer.validated_data["content"]

        try:
            job = Job.objects.select_related("recruiter").get(id=job_id)
        except Job.DoesNotExist:
            return Response(
                {"detail": "Job not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Recipient not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user == job.recruiter:
            recruiter = user
            jobseeker = recipient
        elif recipient == job.recruiter:
            recruiter = recipient
            jobseeker = user
        else:
            return Response(
                {"detail": "Invalid participants for this job"},
                status=status.HTTP_403_FORBIDDEN,
            )

        with transaction.atomic():
            conversation, created = Conversation.objects.get_or_create(
                job=job,
                recruiter=recruiter,
                jobseeker=jobseeker,
            )

            # 5️⃣ Save first message
            message = Message.objects.create(
                conversation=conversation,
                sender=user,
                content=content,
            )

        return Response(
            {
                "conversation_id": conversation.id,
                "message": {
                    "id": message.id,
                    "sender_id": user.id,
                    "content": message.content,
                    "created_at": message.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )