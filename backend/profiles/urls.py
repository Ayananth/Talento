from django.urls import path
from . import views
app_name = "profile"

urlpatterns = [
    path("me/", views.JobSeekerProfileView.as_view(), name="jobseeker-me"),
]