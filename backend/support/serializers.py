from rest_framework import serializers

from .models import SupportTicket, SupportTicketMessage


class SupportTicketMessageSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_email = serializers.EmailField(source="author.email", read_only=True)
    author_role = serializers.CharField(source="author.role", read_only=True)

    class Meta:
        model = SupportTicketMessage
        fields = [
            "id",
            "author",
            "author_username",
            "author_email",
            "author_role",
            "message",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "author",
            "author_username",
            "author_email",
            "author_role",
            "created_at",
        ]


class SupportTicketListSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    class Meta:
        model = SupportTicket
        fields = ["id", "subject", "status", "created_at", "updated_at", "user_email"]


class SupportTicketDetailSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_role = serializers.CharField(source="user.role", read_only=True)
    messages = SupportTicketMessageSerializer(many=True, read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            "id",
            "user",
            "user_username",
            "user_email",
            "user_role",
            "subject",
            "status",
            "created_at",
            "updated_at",
            "messages",
        ]
        read_only_fields = [
            "id",
            "user",
            "user_username",
            "user_email",
            "user_role",
            "created_at",
            "updated_at",
            "messages",
        ]


class SupportTicketCreateSerializer(serializers.ModelSerializer):
    message = serializers.CharField(write_only=True)

    class Meta:
        model = SupportTicket
        fields = ["id", "subject", "message", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "status", "created_at", "updated_at"]

    def create(self, validated_data):
        initial_message = validated_data.pop("message")
        user = validated_data.pop("user")
        ticket = SupportTicket.objects.create(user=user, **validated_data)
        SupportTicketMessage.objects.create(
            ticket=ticket,
            author=user,
            message=initial_message,
        )
        return ticket


class SupportTicketReplySerializer(serializers.Serializer):
    message = serializers.CharField()


class SupportTicketStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=SupportTicket.StatusChoices.choices)

    class Meta:
        model = SupportTicket
        fields = ["status"]
