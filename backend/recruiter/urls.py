from django.urls import path
from . import views

app_name = "recruiter"

urlpatterns = [
    path("profile/draft/create/", views.RecruiterProfileDraftCreateView.as_view(), name="recruiter-profile-draft-create"),
    path("profile/draft/update/", views.RecruiterProfileDraftUpdateView.as_view(), name="recruiter-profile-draft-update"),

    path(
        "recruiter/profile/<int:pk>/reject/", views.AdminRejectRecruiterProfileView.as_view(), name="admin-reject-recruiter-profile",
    ),
    path(
        "recruiter/profile/<int:pk>/approve/", views.AdminApproveRecruiterProfileView.as_view(), name="admin-approve-recruiter-profile",
    ),



]