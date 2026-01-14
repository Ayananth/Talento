import logging
import os

from datetime import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import redirect
from django.urls import reverse
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django_filters.rest_framework import DjangoFilterBackend

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from rest_framework import permissions, status
from rest_framework.decorators import api_view  # remove if unused
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from core.permissions import IsAdmin, IsJobseeker, IsRecruiter

from .serializers import (
    AdminUserDetailSerializer,
    AdminUserListSerializer,
    GoogleAuthSerializer,
    MyTokenObtainPairSerializer,
    PasswordResetRequestSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)
from .tasks import send_password_reset_email_task, send_verification_email
from .utils import generate_email_verification_token

USER = get_user_model()
token_generator = PasswordResetTokenGenerator()
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")

logger = logging.getLogger(__name__)
class SignUpView(APIView):
    def post(self, request):
        email = request.data.get("email")
        logger.info("Signup attempt", extra={"email": email})

        try:
            user = USER.objects.get(email=email)

            if user.is_blocked:
                logger.warning("Blocked user signup attempt", extra={"email": email})
                return Response(
                    {"error": "User is blocked. Please contact the support team!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not user.is_email_verified:
                token = generate_email_verification_token(user)
                verify_url = request.build_absolute_uri(
                    reverse("authentication:verify_email")
                ) + f"?token={token}"

                send_verification_email.delay(user.email, verify_url)

                logger.info(
                    "Verification email resent",
                    extra={"user_id": user.id},
                )

                return Response(
                    {"message": "Account exists but is not verified. Verification email resent."},
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"error": "You can not register with that email id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except USER.DoesNotExist:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            token = generate_email_verification_token(user)
            verify_url = request.build_absolute_uri(
                reverse("authentication:verify_email")
            ) + f"?token={token}"

            send_verification_email.delay(user.email, verify_url)

            logger.info(
                "User created successfully",
                extra={"user_id": user.id},
            )

            return Response(
                {"message": "User created successfully. Verification email sent."},
                status=status.HTTP_201_CREATED,
            )
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            logger.warning("Invalid login credentials")
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.user

        if user.is_blocked:
            logger.warning("Blocked user login attempt", extra={"user_id": user.id})
            return Response(
                {"error": "User is blocked. Please contact the support team!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        refresh = MyTokenObtainPairSerializer.get_token(user)

        logger.info("User logged in", extra={"user_id": user.id})

        response = Response(
            {"access": str(refresh.access_token)},
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="None",
            max_age=7 * 24 * 60 * 60,
            path="v1/auth/token/refresh/",
        )

        return response
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            RefreshToken(refresh_token).blacklist()

            logger.info("User logged out", extra={"user_id": request.user.id})
            return Response({"message": "Logout successful"})

        except Exception:
            logger.warning("Invalid logout token")
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
class VerifyEmailView(APIView):
    def get(self, request):
        token = request.GET.get("token")

        if not token:
            logger.warning("Email verification token missing")
            return Response({"error": "Token missing"}, status=status.HTTP_400_BAD_REQUEST)

        role = "jobseeker"

        try:
            access_token = AccessToken(token)
            role = access_token.get("role", "jobseeker")

            if not access_token.get("email_verification", False):
                logger.warning("Invalid email verification token type")
                return Response({"error": "Invalid token type"}, status=status.HTTP_400_BAD_REQUEST)

            user = USER.objects.get(id=access_token["user_id"])

            if user.is_active:
                logger.info("Email already verified", extra={"user_id": user.id})
                return redirect(settings.FRONTEND_URL + settings.EMAIL_VERIFICATION_SUCCESS_URL)

            user.is_active = True
            user.is_email_verified = True
            user.save()

            logger.info("Email verified successfully", extra={"user_id": user.id})

            return redirect(
                f"{settings.FRONTEND_URL}{settings.EMAIL_VERIFICATION_SUCCESS_URL}?role={role}"
            )

        except Exception:
            logger.exception("Email verification failed")
            return redirect(
                f"{settings.FRONTEND_URL}{settings.EMAIL_VERIFICATION_FAILED_URL}?role={role}"
            )
class ResendVerificationEmailView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            logger.warning(
                "Resend verification email failed: email missing"
            )
            return Response(
                {"error": "Email field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(
            "Resend verification email requested",
            extra={"email": email},
        )

        try:
            user = USER.objects.get(email=email)
        except USER.DoesNotExist:
            logger.warning(
                "Resend verification email failed: user not found",
                extra={"email": email},
            )
            return Response(
                {"error": "No account found with this email."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user.is_active:
            logger.info(
                "Resend verification email skipped: already verified",
                extra={"user_id": user.id},
            )
            return Response(
                {"message": "Email already verified."},
                status=status.HTTP_200_OK,
            )

        token = generate_email_verification_token(user)
        verify_url = request.build_absolute_uri(
            reverse("authentication:verify_email")
        ) + f"?token={token}"

        send_verification_email.delay(user.email, verify_url)

        logger.info(
            "Verification email resent successfully",
            extra={"user_id": user.id},
        )

        return Response(
            {"message": "Verification email resent successfully."},
            status=status.HTTP_200_OK,
        )

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower().strip()
        logger.info("Password reset requested", extra={"email": email})

        try:
            user = USER.objects.get(email=email)

            if user.is_blocked:
                logger.warning("Blocked user password reset", extra={"user_id": user.id})
                return Response(
                    {"error": "User is blocked. Please contact the support team!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not user.is_active or not user.is_email_verified:
                return Response(
                    {"detail": "If an account exists, reset instructions were sent."},
                    status=status.HTTP_200_OK,
                )

            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)
            reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?uid={uidb64}&token={token}"

            send_password_reset_email_task.delay(user.email, reset_url)

        except USER.DoesNotExist:
            pass

        return Response(
            {"detail": "If an account exists, reset instructions were sent."},
            status=status.HTTP_200_OK,
        )

class ResetPasswordView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        logger.info("Password reset attempt")

        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            logger.info("Password reset successful")
            return Response(
                {"detail": "Password reset successful"},
                status=status.HTTP_200_OK,
            )

        logger.warning(
            "Password reset failed",
            extra={"errors": serializer.errors},
        )

class GoogleLoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        logger.info("Google login health check")
        return Response({"ok": "ok"}, status=status.HTTP_200_OK)

    def post(self, request):
        logger.info("Google login attempt")

        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data["role"]

        try:
            token = serializer.validated_data["id_token"]

            id_info = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                GOOGLE_CLIENT_ID,
            )

            if id_info.get("iss") not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                logger.warning("Google login failed: invalid issuer")
                return Response(
                    {"detail": "Wrong issuer."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email = id_info.get("email")
            google_sub = id_info.get("sub")
            email_verified = id_info.get("email_verified", False)

            if not email:
                logger.warning("Google login failed: email missing")
                return Response(
                    {"detail": "Google token did not contain an email."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                user = USER.objects.get(email__iexact=email)

                if user.role and user.role != role:
                    logger.warning(
                        "Google login role mismatch",
                        extra={
                            "email": email,
                            "existing_role": user.role,
                            "requested_role": role,
                        },
                    )
                    return Response(
                        {"detail": f"Role mismatch. You already registered as {user.role}"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if not getattr(user, "google_sub", None):
                    user.google_sub = google_sub
                    user.is_email_verified = user.is_email_verified or email_verified
                    user.save(update_fields=["google_sub", "is_email_verified"])

                    logger.info(
                        "Google account linked to existing user",
                        extra={"user_id": user.id},
                    )

            except USER.DoesNotExist:
                user = USER.objects.create(
                    username=email.split("@")[0],
                    email=email,
                    google_sub=google_sub,
                    role=role,
                    is_email_verified=email_verified,
                )
                user.set_unusable_password()
                user.save()

                logger.info(
                    "New user created via Google login",
                    extra={"user_id": user.id},
                )

            refresh = RefreshToken.for_user(user)
            refresh["role"] = user.role
            refresh["email"] = user.email
            refresh.access_token["role"] = user.role
            refresh.access_token["email"] = user.email

            logger.info(
                "Google login successful",
                extra={"user_id": user.id},
            )

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                    },
                },
                status=status.HTTP_200_OK,
            )

        except ValueError:
            logger.warning("Google login failed: invalid token")
            return Response(
                {"detail": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            logger.exception("Google login failed due to server error")
            return Response(
                {"detail": "Something went wrong. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class AdminUserListView(ListAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AdminUserListSerializer
    queryset = USER.objects.all()

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    search_fields = ["email", "username"]

    filterset_fields = {
        "role": ["exact"],
        "is_blocked": ["exact"],
        "is_email_verified": ["exact"],
    }

    ordering_fields = ["email", "username", "role", "is_active"]
    ordering = ["-date_joined"]


class AdminUserDetailView(RetrieveAPIView):
    """
    GET /api/admin/users/<id>/
    """
    serializer_class = AdminUserDetailSerializer
    permission_classes = [IsAdmin]
    queryset = USER.objects.all()
