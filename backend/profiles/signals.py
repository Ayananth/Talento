from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import JobSeekerProfile

from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if not created:
        return  # Only run on first creation

    if instance.role == "jobseeker":
        JobSeekerProfile.objects.create(
            user=instance,
            fullname=getattr(instance, "full_name", "") or getattr(instance, "username", "") or "",

        )
