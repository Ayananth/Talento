from django.urls import path
from . import views

app_name = "recruiter"

urlpatterns = [
    path("profile/draft/create/", views.RecruiterProfileDraftCreateView.as_view(), name="recruiter-profile-draft-create"),
    path("profile/draft/update/", views.RecruiterProfileDraftUpdateView.as_view(), name="recruiter-profile-draft-update"),



]