from django.db import models
from cloudinary.models import CloudinaryField
from profiles.models import JobSeekerProfile

class JobApplication(models.Model):

    class Status(models.TextChoices):
        APPLIED = "applied", "Applied"
        SHORTLISTED = "shortlisted", "Shortlisted"
        INTERVIEW = "interview", "Interview"
        OFFERED = "offered", "Offered"
        HIRED = "hired", "Hired"
        REJECTED = "rejected", "Rejected"
        WITHDRAWN = "withdrawn", "Withdrawn"

    job = models.ForeignKey(
        "jobs.Job",
        on_delete=models.CASCADE,
        related_name="applications"
    )

    applicant = models.ForeignKey(
        JobSeekerProfile, 
        on_delete=models.CASCADE,
        related_name="applications"
    )

    resume = CloudinaryField(
        resource_type="raw",
        folder="talento/resumes/applications",
        null=True,
        blank=True
    )

    cover_letter = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED
    )

    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("job", "applicant")
        ordering = ["-applied_at"]

    def __str__(self):
        return f"{self.applicant.user.email} → {self.job.title}"
