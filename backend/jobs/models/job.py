from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Job(models.Model):

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        CLOSED = "closed", "Closed"
        BLOCKED = "blocked", "Blocked"

    class JobType(models.TextChoices):
        FULL_TIME = "full_time", "Full Time"
        PART_TIME = "part_time", "Part Time"
        INTERNSHIP = "internship", "Internship"
        CONTRACT = "contract", "Contract"

    class WorkMode(models.TextChoices):
        REMOTE = "remote", "Remote"
        HYBRID = "hybrid", "Hybrid"
        ONSITE = "onsite", "Onsite"

    class ExperienceLevel(models.TextChoices):
        FRESHER = "fresher", "Fresher"
        MID = "mid", "Mid Level"
        SENIOR = "senior", "Senior"

    #Ownership
    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    # Basic Info
    title = models.CharField(max_length=255)
    description = models.TextField()

    #Job Details
    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices
    )

    work_mode = models.CharField(
        max_length=20,
        choices=WorkMode.choices
    )

    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices
    )

    #  Location
    location_city = models.CharField(max_length=100, blank=True, null=True)
    location_state = models.CharField(max_length=100, blank=True, null=True)
    location_country = models.CharField(max_length=100, default="India")

    # Salary
    salary_min = models.PositiveIntegerField(blank=True, null=True)
    salary_max = models.PositiveIntegerField(blank=True, null=True)
    salary_currency = models.CharField(max_length=10, default="INR")
    salary_hidden = models.BooleanField(default=False)

    # Hiring
    openings = models.PositiveIntegerField(default=1)

    # Skills
    skills = models.ManyToManyField(
        "JobSkill",
        blank=True,
        related_name="jobs"
    )

    # Status & Visibility
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    is_active = models.BooleanField(default=True)

    # Dates
    published_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    # Analytics
    view_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["recruiter"]),
        ]

    def __str__(self):
        return self.title
