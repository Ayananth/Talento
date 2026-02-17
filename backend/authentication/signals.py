# authentication/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from django.contrib.auth import get_user_model

from authentication.usecases import notify_admins_new_user

User = get_user_model()


@receiver(post_save, sender=User, dispatch_uid="notify_admin_new_user")
def notify_new_user_signal(sender, instance, created, **kwargs):
    if not created:
        return

    transaction.on_commit(
        lambda: notify_admins_new_user(instance)
    )
