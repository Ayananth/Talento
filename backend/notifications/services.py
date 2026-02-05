from .models import Notification

def create_notification(**kwargs):
    required = ["user", "title", "message", "type"]

    for field in required:
        if field not in kwargs:
            raise ValueError(f"Missing required field: {field}")

    return Notification.objects.create(**kwargs)
