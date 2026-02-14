from django.urls import path
from jobs.views.recruiter import (
    RecruiterJobCreateView,
    RecruiterJobListView,
    RecruiterJobDetailView,
    RecruiterJobUpdateView,
    RecruiterJobDeleteView,
)
from jobs.views.public import (
    PublicJobListView,
    PublicJobDetailView,
    PublicSavedJobsListView,
    SaveJobView,
    UnsaveJobView,
    LandingPageStatsView,
    JobResumeSimilarityView,
)
# from jobs.views.jobseeker import JobApplyView

app_name = "jobs"

urlpatterns = [
    # ---------------------------
    # RECRUITER
    # ---------------------------

    # Create job
    path(
        "jobs/",
        RecruiterJobCreateView.as_view(),
        name="job-create"
    ),

    # List recruiter jobs
    path(
        "recruiter/jobs/",
        RecruiterJobListView.as_view(),
        name="recruiter-job-list"
    ),

    # View job detail (recruiter)
    path(
        "recruiter/jobs/<int:pk>/",
        RecruiterJobDetailView.as_view(),
        name="recruiter-job-detail"
    ),

    # Update job
    path(
        "recruiter/jobs/<int:pk>/update/",
        RecruiterJobUpdateView.as_view(),
        name="recruiter-job-update"
    ),

    # Close / delete job (soft delete)
    path(
        "recruiter/jobs/<int:pk>/delete/",
        RecruiterJobDeleteView.as_view(),
        name="recruiter-job-delete"
    ),

    # ---------------------------
    # PUBLIC
    # ---------------------------

    path(
        "jobs/public/",
        PublicJobListView.as_view(),
        name="public-job-list"
    ),

    path(
        "jobs/public/<int:pk>/",
        PublicJobDetailView.as_view(),
        name="public-job-detail"
    ),

    path(
        "public/stats",
        LandingPageStatsView.as_view(),
        name="public-stats"
    ),

    path(
        "jobs/public/saved/",
        PublicSavedJobsListView.as_view(),
        name='public-saved-job-list'
    ),

    path(
        "jobs/public/similarity/",
        JobResumeSimilarityView.as_view(),
        name="job-resume-similarity",
    ),

    path("<int:job_id>/save/", SaveJobView.as_view(), name="save-job"),
    path("<int:job_id>/unsave/", UnsaveJobView.as_view(), name="unsave-job"),

    # ---------------------------
    # JOBSEEKER
    # ---------------------------

    # path(
    #     "jobs/<int:job_id>/apply/",
    #     JobApplyView.as_view(),
    #     name="job-apply"
    # ),

]
