# jobs/urls.py
from django.urls import path
from jobs.views.recruiter import JobCreateView, JobPublishView, RecruiterJobListView

app_name = "jobs"

urlpatterns = [
    path("jobs/", JobCreateView.as_view(), name="job-create"),
    path("jobs/<int:pk>/publish/", JobPublishView.as_view(), name="job-publish"),
    path(
        "recruiter/jobs/",
        RecruiterJobListView.as_view(),
        name="recruiter-job-list"
    ),
]
