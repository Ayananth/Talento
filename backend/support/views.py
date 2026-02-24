from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsNotBlocked

from .models import SupportTicket, SupportTicketMessage
from .permissions import IsTicketOwnerOrAdmin
from .serializers import (
    SupportTicketCreateSerializer,
    SupportTicketDetailSerializer,
    SupportTicketListSerializer,
    SupportTicketMessageSerializer,
    SupportTicketReplySerializer,
    SupportTicketStatusUpdateSerializer,
)


class SupportTicketViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated, IsNotBlocked, IsTicketOwnerOrAdmin]
    queryset = SupportTicket.objects.select_related("user").prefetch_related("messages__author")
    http_method_names = ["get", "post", "patch", "head", "options"]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["status"]
    ordering_fields = ["id", "subject", "status", "created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(user=user)

    def get_serializer_class(self):
        if self.action == "create":
            return SupportTicketCreateSerializer
        if self.action == "list":
            return SupportTicketListSerializer
        if self.action == "retrieve":
            return SupportTicketDetailSerializer
        if self.action == "partial_update":
            return SupportTicketStatusUpdateSerializer
        if self.action == "reply":
            return SupportTicketReplySerializer
        return SupportTicketDetailSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response(
                {"detail": "Only admins can update ticket status."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=["post"], url_path="reply")
    def reply(self, request, pk=None):
        ticket = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = SupportTicketMessage.objects.create(
            ticket=ticket,
            author=request.user,
            message=serializer.validated_data["message"],
        )

        return Response(
            SupportTicketMessageSerializer(message).data,
            status=status.HTTP_201_CREATED,
        )
