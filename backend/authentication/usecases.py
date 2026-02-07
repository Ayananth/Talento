from authentication.services import get_admin_users
from notifications.services import bulk_create_notifications

def notify_admins_new_user(user):
    admins = get_admin_users()

    data_list = [
        {
            "user": admin,
            "user_role": "admin",
            "title": "New User Registered",
            "message": f"New user registered: {user.username or user.email} as {user.role}",
            "type": "UserRegistraion",
            "related_id": user.id,
        }
        for admin in admins
    ]

    if data_list:
        bulk_create_notifications(data_list)
