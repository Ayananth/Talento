from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField


class RecruiterProfile(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recruiter_profile"
    )

    # Basic Company Info
    company_name = models.CharField(max_length=255)
    website = models.URLField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    company_size = models.CharField(max_length=50, blank=True, null=True)

    # Branding
    logo = CloudinaryField("company_logo", blank=True, null=True)
    draft_logo = CloudinaryField("draft_company_logo", blank=True, null=True)

    # Description
    about_company = models.TextField(blank=True, null=True)

    # Contact
    phone = models.CharField(max_length=50, blank=True, null=True)
    support_email = models.EmailField(blank=True, null=True)

    # Location
    location = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Social
    linkedin = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)

    # Business Verification
    business_registration_doc = CloudinaryField(
        "business_registration_document",
        resource_type='raw', 
        folder="talento-dev/recruiters/business",
        blank=True,
        null=True
    )
    draft_business_registration_doc = CloudinaryField(
        "business_registration_document",
        resource_type='raw', 
        folder="talento-dev/recruiters/business/draft",
        blank=True,
        null=True
        )


    # Review Workflow
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
    rejection_reason = models.TextField(blank=True, null=True)
    verified_at = models.DateTimeField(blank=True, null=True)

    pending_data = models.JSONField(blank=True, null=True)

    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} ({self.user.email})"
