from django.urls import path
from . import views
app_name = "profile"

urlpatterns = [
    path("me/", views.JobSeekerProfileView.as_view(), name="jobseeker-me"),
    path("me/profile-image/", views.JobSeekerProfileImageView.as_view()),
    path("me/update/", views.JobSeekerProfileUpdateView.as_view()),

    path("me/skills/", views.JobSeekerSkillView.as_view()),
    path("me/skills/<int:pk>/", views.JobSeekerSkillView.as_view()),

    path("me/experience/", views.JobSeekerExperienceView.as_view()),
    path("me/experience/<int:pk>/", views.JobSeekerExperienceView.as_view()),

    path("me/education/", views.JobSeekerEducationView.as_view()),
    path("me/education/<int:pk>/", views.JobSeekerEducationView.as_view()),

    path("me/languages/", views.JobSeekerLanguageView.as_view()),
    path("languages/<int:pk>/", views.JobSeekerLanguageView.as_view()),

    path("me/accomplishments/", views.JobSeekerAccomplishmentView.as_view()),
    path("accomplishments/<int:pk>/", views.JobSeekerAccomplishmentView.as_view()),

    path("me/resumes/", views.JobSeekerResumeView.as_view()),
    path("me/resumes/<int:pk>/", views.JobSeekerResumeView.as_view()),
    path("me/resumes/<int:pk>/confirm/", views.ConfirmResumeAPIView.as_view()),
    path("me/resumes/<int:resume_id>/set-default/", views.SetDefaultResumeAPIView.as_view()),


]
