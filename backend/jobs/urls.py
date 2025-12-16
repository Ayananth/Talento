# jobs/urls.py
from django.urls import path
from jobs.views.recruiter import JobCreateView, JobPublishView, RecruiterJobListView, JobUpdateView, JobCloseView
from jobs.views.public import PublicJobListView, PublicJobDetailView

app_name = "jobs"

urlpatterns = [
    path("jobs/", JobCreateView.as_view(), name="job-create"),
    path("jobs/<int:pk>/publish/", JobPublishView.as_view(), name="job-publish"),
    path(
        "recruiter/jobs/",
        RecruiterJobListView.as_view(),
        name="recruiter-job-list"
    ),

    path("jobs/<int:pk>/", JobUpdateView.as_view(), name="job-update"),
    path("jobs/<int:pk>/close/", JobCloseView.as_view(), name="job-close"),



 path("jobs/public/", PublicJobListView.as_view(), name="public-job-list"),
path("jobs/public/<int:pk>/", PublicJobDetailView.as_view(), name="public-job-detail"),

]
 