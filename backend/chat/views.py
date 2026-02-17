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
from recruiter.models import RecruiterProfile

from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer,
    MessageSerializer,
    StartConversationSerializer,
    ChatFileUploadSerializer,
)
from .services import upload_chat_file_to_cloudinary

logger = logging.getLogger(__name__)

class ConversationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(f"Conversation list requested | user_id={request.user.id}")

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

        logger.info(f"{serializer=}")

        return Response(serializer.data)


class ConversationMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        logger.info(
            f"Conversation messages requested | conversation_id={conversation_id} | user_id={request.user.id}"
        )

        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
        )

        if request.user not in [conversation.jobseeker, conversation.recruiter]:
            logger.warning(
                f"Unauthorized access | conversation_id={conversation_id} | user_id={request.user.id}"
            )
            return Response(
                {"detail": "Forbidden"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        messages = (
            Message.objects
            .filter(conversation=conversation)
            .select_related("sender")
            .select_related("attachment")
            .order_by("created_at")
        )

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class StartConversationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logger.info(f"Start conversation requested | user_id={request.user.id}")

        serializer = StartConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        job_id = serializer.validated_data["job_id"]
        recipient_id = serializer.validated_data["recipient_id"]
        content = serializer.validated_data["content"]

        logger.info(f"Message content: {content}")
        logger.info("Starting conversation process")

        try:
            job = Job.objects.select_related("recruiter").get(id=job_id)
        except Job.DoesNotExist:
            logger.warning(f"Job not found | job_id={job_id}")
            return Response(
                {"detail": "Job not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            if user.role == "jobseeker":
                recipient = RecruiterProfile.objects.get(id=recipient_id).user
            else:
                recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            logger.warning(f"Recipient not found | recipient_id={recipient_id}")
            return Response(
                {"detail": "Recipient not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        logger.info(f"user={user}")
        logger.info(f"job={job}")
        logger.info(f"recipient={recipient}")

        if user == job.recruiter.user:
            recruiter = user
            jobseeker = recipient
        elif recipient == job.recruiter.user:
            recruiter = recipient
            jobseeker = user
        else:
            logger.warning(
                f"Invalid participants | job_id={job_id} | user_id={user.id} | recipient_id={recipient.id}"
            )
            return Response(
                {"detail": "Invalid participants for this job in start conversation"},
                status=status.HTTP_400_BAD_REQUEST,
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
            f"Conversation started | conversation_id={conversation.id} | created={created} | sender_id={user.id}"
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
            f"Get conversation requested | job_id={job_id} | other_user_id={other_user_id} | user_id={request.user.id}"
        )

        if not job_id or not other_user_id:
            logger.warning(
                f"Missing parameters | user_id={request.user.id}"
            )
            return Response(
                {"detail": "job_id and other_user_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            job = Job.objects.select_related("recruiter").get(id=job_id)
        except Job.DoesNotExist:
            logger.warning(f"Job not found | job_id={job_id}")
            return Response(
                {"detail": "Job not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            user = request.user
            if user.role == "jobseeker":
                other_user = RecruiterProfile.objects.get(id=other_user_id).user
            else:
                other_user = User.objects.get(id=other_user_id)

            logger.info(f"other_user={other_user}")

        except User.DoesNotExist:
            logger.warning(f"User not found | other_user_id={other_user_id}")
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        logger.info(f"user={user}")
        logger.info(f"job_recruiter={job.recruiter.user}")

        if user == job.recruiter.user:
            recruiter = user
            jobseeker = other_user
        elif other_user == job.recruiter.user:
            recruiter = other_user
            jobseeker = user
        else:
            logger.info(
                f"Invalid participants | job_id={job_id} | user_id={user.id} | other_user_id={other_user.id}"
            )
            return Response(
                {"detail": "Invalid participants for this job"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        conversation = Conversation.objects.filter(
            job=job,
            recruiter=recruiter,
            jobseeker=jobseeker,
        ).first()

        if not conversation:
            logger.info(f"No conversation found | job_id={job_id} | user_id={user.id}")
            return Response(
                {"conversation": None},
                status=status.HTTP_200_OK,
            )

        logger.info(
            f"Conversation found | conversation_id={conversation.id} | user_id={user.id}"
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
        logger.info(f"Chat file upload requested | chat_id={chat_id} | user_id={request.user.id}")

        serializer = ChatFileUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data["file"]

        upload_data = upload_chat_file_to_cloudinary(file, chat_id)

        logger.info(
            f"File uploaded | chat_id={chat_id} | file_name={upload_data['file_name']}"
        )

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
