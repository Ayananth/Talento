from django.db import models
from django.conf import settings
from .choices import TypeChoices, RoleChoices



class Notification(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    user_role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.ADMIN
    )

    title = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField(blank=True, null=True)

    type = models.CharField(
        max_length=50,
        choices=TypeChoices.choices,
        default=TypeChoices.OTHER
    )

    related_id = models.IntegerField(null=True, blank=True)

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["type"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.title or self.type}"
