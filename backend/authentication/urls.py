from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,

)
from . import views


app_name = "authentication"

urlpatterns = [
    path("register/jobseeker", view=views.JobSeekerSignUpView.as_view(), name="register_jobseeker"),
    path("register/recruiter", view=views.RecruiterSignUpView.as_view(), name="register_recruiter"),

    path('signin', views.MyTokenObtainPairView.as_view(), name='sign_in'),
    path('signout', views.LogoutView.as_view(), name='sign_out'),


    path('token/refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),
    path("verify-email/", views.VerifyEmailView.as_view(), name="verify_email"),
    path("resend-verification-email/", views.ResendVerificationEmailView.as_view(), name="resend_verification_email"),
    path("request-password-reset/", views.PasswordResetRequestView.as_view(), name="request-password-reset"),
    path("reset-password/", views.ResetPasswordView.as_view(), name="reset-password"),
    path('google-login/', views.GoogleLoginAPIView.as_view(), name='google-login'),




    path("admin/users/", views.AdminUserListView.as_view(), name="admin-user-list"),
    path("admin/users/<int:pk>/", views.AdminUserDetailView.as_view(), name="admin-user-detail"),







]
