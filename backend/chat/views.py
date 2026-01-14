import logging

from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import UserModel as User
from jobs.models.job import Job

from .services import upload_chat_file_to_cloudinary


from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer,
    MessageSerializer,
    StartConversationSerializer,
    ChatFileUploadSerializer
)

logger = logging.getLogger(__name__)


class ConversationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(
            "Conversation list requested",
            extra={"user_id": request.user.id},
        )

        conversations = Conversation.objects.filter(
            Q(jobseeker=request.user) | Q(recruiter=request.user)
        ).select_related(
            "job",
            "jobseeker",
            "recruiter",
        ).prefetch_related(
            "messages"
        ).order_by("-created_at")

        serializer = ConversationListSerializer(
            conversations,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)


class ConversationMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        logger.info(
            "Conversation messages requested",
            extra={
                "conversation_id": conversation_id,
                "user_id": request.user.id,
            },
        )

        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
        )

        # Permission check (very important)
        if request.user not in [conversation.jobseeker, conversation.recruiter]:
            logger.warning(
                "Unauthorized access to conversation messages",
                extra={
                    "conversation_id": conversation_id,
                    "user_id": request.user.id,
                },
            )
            return Response(
                {"detail": "Forbidden"},
                status=status.HTTP_403_FORBIDDEN,
            )

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
        logger.info(
            "Start conversation requested",
            extra={"user_id": request.user.id},
        )

        serializer = StartConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        job_id = serializer.validated_data["job_id"]
        recipient_id = serializer.validated_data["recipient_id"]
        content = serializer.validated_data["content"]

        try:
            job = Job.objects.select_related("recruiter").get(id=job_id)
        except Job.DoesNotExist:
            logger.warning(
                "Job not found while starting conversation",
                extra={"job_id": job_id},
            )
            return Response(
                {"detail": "Job not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            logger.warning(
                "Recipient not found while starting conversation",
                extra={"recipient_id": recipient_id},
            )
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
            logger.warning(
                "Invalid participants for job conversation",
                extra={
                    "job_id": job_id,
                    "user_id": user.id,
                    "recipient_id": recipient.id,
                },
            )
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

            message = Message.objects.create(
                conversation=conversation,
                sender=user,
                content=content,
            )

        logger.info(
            "Conversation started",
            extra={
                "conversation_id": conversation.id,
                "conversation_created": created,
                "sender_id": user.id,
            },
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


class GetConversationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        job_id = request.query_params.get("job_id")
        other_user_id = request.query_params.get("other_user_id")

        logger.info(
            "Get conversation requested",
            extra={
                "job_id": job_id,
                "other_user_id": other_user_id,
                "user_id": request.user.id,
            },
        )

        if not job_id or not other_user_id:
            logger.warning(
                "Missing parameters in get conversation request",
                extra={"user_id": request.user.id},
            )
            return Response(
                {"detail": "job_id and other_user_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            job = Job.objects.select_related("recruiter").get(id=job_id)
        except Job.DoesNotExist:
            logger.warning(
                "Job not found while fetching conversation",
                extra={"job_id": job_id},
            )
            return Response(
                {"detail": "Job not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            logger.warning(
                "User not found while fetching conversation",
                extra={"other_user_id": other_user_id},
            )
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user

        if user == job.recruiter:
            recruiter = user
            jobseeker = other_user
        elif other_user == job.recruiter:
            recruiter = other_user
            jobseeker = user
        else:
            logger.warning(
                "Invalid participants while fetching conversation",
                extra={
                    "job_id": job_id,
                    "user_id": user.id,
                    "other_user_id": other_user.id,
                },
            )
            return Response(
                {"detail": "Invalid participants for this job"},
                status=status.HTTP_403_FORBIDDEN,
            )

        conversation = Conversation.objects.filter(
            job=job,
            recruiter=recruiter,
            jobseeker=jobseeker,
        ).first()

        if not conversation:
            logger.info(
                "No conversation found",
                extra={
                    "job_id": job_id,
                    "user_id": user.id,
                },
            )
            return Response(
                {"conversation": None},
                status=status.HTTP_200_OK,
            )

        logger.info(
            "Conversation found",
            extra={
                "conversation_id": conversation.id,
                "user_id": user.id,
            },
        )

        return Response(
            {
                "conversation": {
                    "id": conversation.id,
                    "job": job.id,
                    "other_user": {
                        "id": other_user.id,
                        "name": other_user.email,
                    },
                }
            },
            status=status.HTTP_200_OK,
        )


class ChatFileUploadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, chat_id):
        serializer = ChatFileUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data["file"]

        upload_data = upload_chat_file_to_cloudinary(file, chat_id)

        return Response(
            {
                "file_url": upload_data["file_url"],
                "file_name": upload_data["file_name"],
                "file_type": upload_data["file_type"],
                "file_size": upload_data["file_size"],
                "public_id": upload_data["public_id"],
            },
            status=status.HTTP_201_CREATED,
        )