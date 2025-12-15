from django.urls import path
from . import views

app_name = "recruiter"

urlpatterns = [
    path("profile/draft/create/", views.RecruiterProfileDraftCreateView.as_view(), name="recruiter-profile-draft-create"),
    path("profile/draft/update/", views.RecruiterProfileDraftUpdateView.as_view(), name="recruiter-profile-draft-update"),
    path("profile/", views.RecruiterProfileDetailView.as_view(), name="recruiter-profile"),

    path(
        "profile/<int:pk>/reject/", views.AdminRejectRecruiterProfileView.as_view(), name="admin-reject-recruiter-profile",
    ),
    path(
        "profile/<int:pk>/approve/", views.AdminApproveRecruiterProfileView.as_view(), name="admin-approve-recruiter-profile",
    ),

    path("recruiters/", views.AdminRecruiterListView.as_view(), name="admin-recruiters-list"),
    path("recruiters/pending/", views.PendingRecruiterListView.as_view(), name="pending-recruiters-list"),


    path(
        "admin/recruiter/<int:pk>/",
        views.AdminRecruiterProfileDetailView.as_view(),
        name="admin-recruiter-detail",
    ),



]