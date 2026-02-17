from authentication.services import get_admin_users
from notifications.services import bulk_create_notifications
from notifications.choices import TypeChoices, RoleChoices


def notify_admins_new_subscription(subscription):
    admins = get_admin_users()

    user = subscription.user
    plan = subscription.plan  

    data_list = [
        {
            "user": admin,
            "user_role": RoleChoices.ADMIN,
            "title": "New Subscriber",
            "message": (
                f"{user.email or user.username} "
                f"subscribed to {plan.name}"
            ),
            "type": TypeChoices.NEW_SUBSCRIBER,
            "related_id": subscription.id,
        }
        for admin in admins
    ]

    if data_list:
        bulk_create_notifications(data_list)
