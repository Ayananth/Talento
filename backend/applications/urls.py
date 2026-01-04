from django.urls import path
from .views import (
    ApplyJobView,
    MyApplicationsView,
    JobApplicationsForRecruiterView,
    # UpdateApplicationStatusView,
    # WithdrawApplicationView,
)


app_name = "applications"

urlpatterns = [

    path("apply/", ApplyJobView.as_view(), name="apply-job"),


    path("my-applications/", MyApplicationsView.as_view(), name="my-applications"),
    path("recruiter/applications/", JobApplicationsForRecruiterView.as_view(), name="recruiter-applications"),
    # path("update-status/<int:application_id>/", UpdateApplicationStatusView.as_view(), name="update-application-status"),
    # path("withdraw/<int:application_id>/", WithdrawApplicationView.as_view(), name="withdraw-application"),           



    





]
