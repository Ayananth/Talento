from django.db import models
from pgvector.django import VectorField
from jobs.models.job import Job
from profiles.models import JobSeekerResume, JobSeekerProfile

class JobEmbedding(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name="embedding")
    source_text = models.TextField(null=True, blank=True) 
    embedding = VectorField(dimensions=1536)

    created_at = models.DateTimeField(auto_now_add=True)


class ResumeEmbedding(models.Model):
    resume = models.OneToOneField(
        JobSeekerResume,
        on_delete=models.CASCADE,
        related_name="embedding"
    )
    source_text = models.TextField(null=True, blank=True) 
    embedding = VectorField(dimensions=1536)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["resume"]),
        ]


class JobResumeInsight(models.Model):
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="resume_insights",
    )
    resume = models.ForeignKey(
        JobSeekerResume,
        on_delete=models.CASCADE,
        related_name="job_insights",
    )

    strengths = models.JSONField()
    gaps = models.JSONField()
    summary = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("job", "resume")
        indexes = [
            models.Index(fields=["job", "resume"]),
        ]
