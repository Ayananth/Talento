from django.urls import path
from . import views


app_name = "custom_admin"

urlpatterns = [

    # path("users/", views.AdminUserListView.as_view(), name="admin-user-list"),
    # path("users/<int:pk>/", views.AdminUserDetailView.as_view(), name="admin-user-detail"),

path(
    "users/<int:pk>/block/",
    views.AdminToggleBlockUserView.as_view(),
    name="admin-toggle-user-block",
),


]