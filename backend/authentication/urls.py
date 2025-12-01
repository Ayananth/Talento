from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,

)
from . import views


app_name = "authentication"

urlpatterns = [
    path("sign_up", view=views.SignUpView.as_view(), name="sign_up"),
    # path("sign_up", view=views.SignUpView, name="sign_up"),
    # path("test", views.test, name="test"),
    # path(route="delete", view=views.DeleteUserView.as_view(), name="delete"),
    # path(route="sign_in", view=views.SignInView.as_view(), name="sign_in"),
    # path(route="pwreset", view=views.PasswordResetView.as_view(), name="pwreset"),

    path('sign_in', views.MyTokenObtainPairView.as_view(), name='sign_in'),
    path('sign_out', views.LogoutView.as_view(), name='sign_out'),


    path('token/refresh', TokenRefreshView.as_view(), name='jwt_refresh'),
    path("verify-email/", views.VerifyEmailView.as_view(), name="verify_email"),





]