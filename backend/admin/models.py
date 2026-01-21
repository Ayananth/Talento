from django.db import models

class AdminNotification(models.Model):
    NOTIFICATION_TYPES = [
        ("recruiter_signup", "Recruiter Signup Request"),
        ("recruiter_edit_request", "Recruiter Profile Edit Request"),
    ]

    type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES
    )

    title = models.CharField(max_length=150)
    message = models.TextField()

    related_object_id = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    related_object_type = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    is_read = models.BooleanField(default=False)
    requires_action = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.type} | {self.title}"
