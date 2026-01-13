from rest_framework import serializers
from .models import Conversation, Message  

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = "__all__"

    def get_sender_name(self, obj):
        user = obj.sender

        # Recruiter
        if hasattr(user, "recruiter_profile"):
            return (
                user.recruiter_profile.company_name
                or user.email
            )

        # Jobseeker
        if hasattr(user, "jobseeker_profile"):
            return (
                user.jobseeker_profile.fullname
                or user.email
            )

        # Fallback (admin/system)
        return user.email



class ConversationListSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    last_message_time = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "job",
            "other_user",
            "last_message",
            "last_message_time",
            "created_at",
        ]

    def get_other_user(self, obj):
        request = self.context["request"]
        user = request.user

        if obj.jobseeker == user:
            return {
                "id": obj.recruiter.id,
                "name": obj.recruiter.recruiter_profile.company_name or obj.recruiter.full_name,    
                "job": obj.job.title,
                "img": obj.recruiter.recruiter_profile.logo.url if obj.recruiter.recruiter_profile.logo else None,
            }
        else:
            return {
                "id": obj.jobseeker.id,
                "name": obj.jobseeker.jobseeker_profile.fullname,
                "job": obj.job.title,
                "img": obj.jobseeker.jobseeker_profile.profile_image.url if obj.jobseeker.jobseeker_profile.profile_image else None,
            }

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by("-created_at").first()
        return last_msg.content if last_msg else None

    def get_last_message_time(self, obj):
        last_msg = obj.messages.order_by("-created_at").first()
        return last_msg.created_at if last_msg else None


class StartConversationSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    recipient_id = serializers.IntegerField()
    content = serializers.CharField(max_length=5000)

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Message cannot be empty")
        return value