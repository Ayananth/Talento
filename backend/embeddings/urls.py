

from django.urls import path
from .views import JobCreateWithEmbeddingAPIView, SemanticJobSearchAPIView
app_name = "embeddings" 

urlpatterns = [
    path("jobs/create/", JobCreateWithEmbeddingAPIView.as_view()),
    path("jobs/search/", SemanticJobSearchAPIView.as_view()),
]
