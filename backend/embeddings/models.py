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
