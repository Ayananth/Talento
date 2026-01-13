from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Conversation(models.Model):
    job = models.ForeignKey(
        "jobs.Job",
        on_delete=models.CASCADE,
        related_name="conversations"
    )
    jobseeker = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="jobseeker_conversations"
    )
    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="recruiter_conversations"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job", "jobseeker", "recruiter"],
                name="unique_conversation_per_job"
            )
        ]


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
