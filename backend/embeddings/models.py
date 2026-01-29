from django.db import models
from pgvector.django import VectorField
from jobs.models.job import Job

class JobEmbedding(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name="embedding")
    embedding = VectorField(dimensions=1536)

    created_at = models.DateTimeField(auto_now_add=True)
