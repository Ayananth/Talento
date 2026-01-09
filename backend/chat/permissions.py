from django.contrib.auth import get_user_model
from .models import Conversation

User = get_user_model()

def user_is_conversation_participant(user, conversation_id):
    """
    Returns True if the user is part of the conversation
    """
    return Conversation.objects.filter(
        id=conversation_id
    ).filter(
        jobseeker=user
    ).exists() or Conversation.objects.filter(
        id=conversation_id,
        recruiter=user
    ).exists()
