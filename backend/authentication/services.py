from django.contrib.auth import get_user_model

User = get_user_model()

admin_emails = list(
    User.objects
        .filter(is_staff=True, is_active=True)
        .exclude(email__isnull=True)
        .exclude(email__exact="")
        .values_list("email", flat=True)
)

def get_admin_users():
    return User.objects.filter(
        is_staff=True,
        is_active=True
    )