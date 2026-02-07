from .models import Notification


REQUIRED_FIELDS = ["user", "title", "message", "type"]


def validate_fields(data: dict):
    for field in REQUIRED_FIELDS:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")


def create_notification(**kwargs):
    validate_fields(kwargs)
    return Notification.objects.create(**kwargs)


def bulk_create_notifications(data_list: list[dict], batch_size=1000):
    """
    data_list = [
        {"user": u1, "title": "...", "message": "...", "type": "..."},
        ...
    ]
    """

    notifications = []

    for data in data_list:
        validate_fields(data)
        notifications.append(Notification(**data))

    return Notification.objects.bulk_create(notifications, batch_size=batch_size)
