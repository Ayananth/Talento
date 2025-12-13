from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
from recruiter.models import RecruiterProfile

User = get_user_model()

class Command(BaseCommand):
    help = "Create 15 dummy recruiter users and their profiles"

    def handle(self, *args, **kwargs):
        for i in range(1, 16):
            email = f"recruiter{i}@example.com"

            # Create user if not exists
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": f"recruiter{i}",
                    "role": "recruiter",
                    "is_email_verified": True,
                },
            )

            if created:
                user.set_password("password123")
                user.save()

            # Create recruiter profile if not exists
            RecruiterProfile.objects.get_or_create(
                user=user,
                defaults={
                    "company_name": f"Company {i}",
                    "website": f"https://company{i}.com",
                    "industry": "Technology",
                    "company_size": "51–200",
                    "about_company": f"This is a dummy company number {i}.",
                    "phone": "1234567890",
                    "support_email": f"support{i}@company.com",
                    "location": "New York",
                    "address": "123 Dummy Street",
                    "linkedin": f"https://linkedin.com/company/company{i}",
                    "facebook": "",
                    "twitter": "",
                    "status": "pending",
                }
            )

            self.stdout.write(self.style.SUCCESS(f"Created {email} + RecruiterProfile"))
