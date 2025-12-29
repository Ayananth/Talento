from django.urls import path
from .views import (
    ApplyJobView,
    # MyApplicationsView,
    # JobApplicationsForRecruiterView,
    # UpdateApplicationStatusView,
    # WithdrawApplicationView,
)


app_name = "applications"

urlpatterns = [

    path("apply/", ApplyJobView.as_view(), name="apply-job"),
    





]
