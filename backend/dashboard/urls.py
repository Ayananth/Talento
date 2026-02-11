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
    "jobs/<int:pk>/unpublish",
    views.AdminJobUnpublishView.as_view(),
    name="admin-job-unpublish",
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

    path(
        "transactions/revenue-summary/",
        views.TransactionRevenueSummaryAPIView.as_view(),
        name="admin-transactions-revenue-summary"
    ),
    
    path(
        "transactions/export/",
        views.TransactionExportCSVAPIView.as_view(),
        name="admin-transactions-export",
    ),



]
