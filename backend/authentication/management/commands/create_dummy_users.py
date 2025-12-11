from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from authentication.models import UserModel

class Command(BaseCommand):
    help = "Create 15 dummy users"

    def handle(self, *args, **kwargs):
        for i in range(15):
            email = f"dummy{i+1}@example.com"
            username = f"user{i+1}"
            role = "jobseeker"

            if UserModel.objects.filter(email=email).exists():
                continue

            user = UserModel.objects.create_user(
                email=email,
                password="password123",
                username=username,
                role=role,
                is_email_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f"Created {email}"))
