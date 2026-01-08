from rest_framework import serializers
from .models import Conversation, Message  

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.full_name")

    class Meta:
        model = Message
        fields = "__all__"