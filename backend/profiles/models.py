from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


# ---------------------------------------------------------
# 1. JOB SEEKER PROFILE
# ---------------------------------------------------------
class JobSeekerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="jobseeker_profile")

    fullname = models.CharField(max_length=100)
    headline = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    experience_years = models.PositiveIntegerField(default=0)

    address = models.TextField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    marital_status = models.CharField(max_length=50, blank=True, null=True)

    current_salary = models.PositiveIntegerField(blank=True, null=True)

    open_to_work = models.BooleanField(default=True)
    show_contact = models.BooleanField(default=True)

    last_updated = models.DateTimeField(auto_now=True)



    def __str__(self):
        return f"{self.user} JobSeeker Profile"
    

class JobSeekerSkill(models.Model):
    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name="skills")

    skill_name = models.CharField(max_length=255)

    class Meta:
        unique_together = ("profile", "skill_name")
        indexes = [models.Index(fields=["skill_name"])]

    def __str__(self):
        return self.skill_name


class JobSeekerExperience(models.Model):
    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name="experiences")

    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.role} at {self.company}"
    

class JobSeekerEducation(models.Model):
    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name="education")

    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class JobSeekerResume(models.Model):
    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name="resumes")

    title = models.CharField(max_length=255)
    url = models.TextField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    parsed_data = models.JSONField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title


class JobSeekerAccomplishment(models.Model):
    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name="accomplishments")

    type = models.CharField(max_length=255)
    link = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.type


class JobSeekerLanguage(models.Model):
    PROFICIENCY_CHOICES = [
        ("basic", "Basic"),
        ("intermediate", "Intermediate"),
        ("fluent", "Fluent"),
        ("native", "Native"),
    ]

    profile = models.ForeignKey(JobSeekerProfile, on_delete=models.CASCADE, related_name="languages")

    language = models.CharField(max_length=255)
    proficiency = models.CharField(max_length=50, choices=PROFICIENCY_CHOICES, default="basic")

    read = models.BooleanField(default=True)
    write = models.BooleanField(default=True)
    speak = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.language} ({self.proficiency})"
    




# ---------------------------------------------------------
# 2. RECRUITER PROFILE
# ---------------------------------------------------------
class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="recruiter_profile")

    company_name = models.CharField(max_length=255)
    website = models.CharField(max_length=255, blank=True, null=True)
    logo_url = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    industry = models.CharField(max_length=255, blank=True, null=True)

    location = models.CharField(max_length=255, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)

    verified = models.BooleanField(default=False)
    joined_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} - {self.user}"