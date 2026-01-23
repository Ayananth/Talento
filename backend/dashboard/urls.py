from django.urls import path
from . import views


app_name = "custom_admin"

urlpatterns = [

    # path("users/", views.AdminUserListView.as_view(), name="admin-user-list"),
    # path("users/<int:pk>/", views.AdminUserDetailView.as_view(), name="admin-user-detail"),

path(
    "dashboard/overview",
    views.AdminDashboardView.as_view(),
    name="admin-dashboard-overview",
),

path(
    "users/<int:pk>/block/",
    views.AdminToggleBlockUserView.as_view(),
    name="admin-toggle-user-block",
),
path(
    "jobs/",
    views.AdminJobListView.as_view(),
    name="admin-jobs-list",
),

path(
    "jobs/<int:pk>",
    views.AdminJobDetailView.as_view(),
    name="admin-jobs-list",
),

path(
    "recruiters/<int:pk>/job-posting/",
    views.AdminRecruiterJobPostingView.as_view(),
    name="admin-job-toggle",
),
    path(
        "pending-counts/",
        views.AdminPendingCountsAPIView.as_view(),
        name="admin-pending-counts"
    ),

    path(
        "transactions/",
        views.TransactionListAPIView.as_view(),
        name="admin-transactions"
    ),




]