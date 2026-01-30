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
        resource_type="image",
        folder="talento/resumes/applications",
        null=True,
        blank=True
    )

    cover_letter = models.TextField(blank=True)
    
    current_salary = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Current salary in INR"
    )

    expected_salary = models.PositiveIntegerField(
        help_text="Expected salary in INR"
    )

    notice_period = models.CharField(
        max_length=50,
        blank=True,
        help_text="Notice period (e.g. 30 days, Immediate)"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED
    )
    recruiter_notes = models.TextField(blank=True)

    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, blank=True)
    experience = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        null=True,
        blank=True
    )
    current_role = models.CharField(max_length=100, blank=True)

    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    match_score = models.FloatField(
        null=True,
        blank=True,
        help_text="AI similarity score between resume and job (0-100)"
    )


    class Meta:
        unique_together = ("job", "applicant")
        ordering = ["-applied_at"]

    def __str__(self):
        return f"{self.applicant.user.email} → {self.job.title}"
