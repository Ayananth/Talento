from rest_framework import serializers
from .models import Conversation, Message  

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.full_name")

    class Meta:
        model = Message
        fields = "__all__"



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
            }
        else:
            return {
                "id": obj.jobseeker.id,
                "name": obj.jobseeker.full_name,
            }

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by("-created_at").first()
        return last_msg.content if last_msg else None

    def get_last_message_time(self, obj):
        last_msg = obj.messages.order_by("-created_at").first()
        return last_msg.created_at if last_msg else None
