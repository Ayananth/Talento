from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view #for FBV, remove if not used
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import MyTokenObtainPairSerializer, PasswordResetRequestSerializer, UserSerializer, ResetPasswordSerializer,AdminUserListSerializer,  AdminUserDetailSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from datetime import datetime
from django.shortcuts import redirect
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .serializers import GoogleAuthSerializer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
from core.permissions import IsAdmin, IsRecruiter, IsJobseeker

from rest_framework.exceptions import AuthenticationFailed




from .utils import generate_email_verification_token
from .tasks import send_verification_email, send_password_reset_email_task



from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.filters import SearchFilter, OrderingFilter

from core.permissions import IsAdmin


USER = get_user_model()
token_generator = PasswordResetTokenGenerator()
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")





class SignUpView(APIView):
    def post(self, request):
        email = request.data.get("email")


        try:
            user = USER.objects.get(email=email)
            if user.is_blocked:
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

                return Response(
                    {"message": "Account already exists but is not verified. Verification email resent."},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"error": "User already exists and is verified. Please log in."},
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

            return Response(
                {"message": "User created successfully. Verification email sent."},
                status=status.HTTP_201_CREATED,
            )


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": "Invalid credentials"}, status=400)
        
        user = serializer.user
        if user.is_blocked:
            return Response(
                {"error": "User is blocked. Please contact the support team!"},
                status=status.HTTP_400_BAD_REQUEST,
                )

        refresh = MyTokenObtainPairSerializer.get_token(user)
        response = Response(
            {"access": str(refresh.access_token)},
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly = True,
            secure=False,
            samesite="None",
            max_age=7*24*60* 60,
            path="v1/auth/token/refresh/"

        )

        return response
        

# class CustomTokenRefreshView(TokenRefreshView):
#     serializer_class = 




class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)





class VerifyEmailView(APIView):
    def get(self, request):
        token = request.GET.get("token")


        if not token:
            return Response({"error": "Token missing"}, status=400)

        role = "jobseeker"

        try:
            access_token = AccessToken(token)
            role = access_token.get("role", "jobseeker")
            

            # Ensure it is an email verification token
            if not access_token.get("email_verification", False):
                return Response({"error": "Invalid token type"}, status=400)

            user_id = access_token["user_id"]
            user = USER.objects.get(id=user_id)



            if user.is_active:
                return redirect(settings.FRONTEND_URL + settings.EMAIL_VERIFICATION_SUCCESS_URL)

            # Activate the user
            user.is_active = True
            user.is_email_verified = True
            print(user)
            user.save()

            success_url = (
                f"{settings.FRONTEND_URL}{settings.EMAIL_VERIFICATION_SUCCESS_URL}"
                f"?role={role}"
            )

            return redirect(success_url)

        except Exception as e:
            failed_url = (
                f"{settings.FRONTEND_URL}{settings.EMAIL_VERIFICATION_FAILED_URL}"
                f"?role={role}"
            )

            return redirect(failed_url)

        



class ResendVerificationEmailView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = USER.objects.get(email=email)
        except USER.DoesNotExist:
            return Response(
                {"error": "No account found with this email."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Already verified
        if user.is_active:
            return Response(
                {"message": "Email already verified."},
                status=status.HTTP_200_OK,
            )

        # Generate new verification token
        token = generate_email_verification_token(user)
        
        verify_url = request.build_absolute_uri(
            reverse("authentication:verify_email")
        ) + f"?token={token}"

        # Send email asynchronously with Celery
        send_verification_email.delay(user.email, verify_url)

        return Response(
            {"message": "Verification email resent successfully."},
            status=status.HTTP_200_OK,
        )
    

class PasswordResetRequestView(APIView):
    def post(self, request):
        serliazer = PasswordResetRequestSerializer(data = request.data)
        serliazer.is_valid(raise_exception=True)
        email = serliazer.validated_data["email"].lower().strip()
        try:
            user = USER.objects.get(email=email)
            if user.is_blocked:
                return Response(
                    {"error": "User is blocked. Please contact the support team!"},
                    status=status.HTTP_400_BAD_REQUEST,
                    )

            if not user.is_active or not user.is_email_verified:
                return Response(
                    {"detail": "If an account with that email exists, we sent password reset instructions."},
                    status=status.HTTP_200_OK,
                )
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)
            frontend_base = getattr(settings, "FRONTEND_URL", None)
            if not frontend_base:
                return Response(
                    {'message': "Something wrong with our end. Please try again later..."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            reset_path = f"/reset-password?uid={uidb64}&token={token}"
            reset_url = f"{frontend_base.rstrip('/')}{reset_path}"
            send_password_reset_email_task.delay(user.email, reset_url)

        except USER.DoesNotExist:
            pass


        return Response(
            {"detail": "If an account with that email exists, we sent password reset instructions."},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Password reset successful"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        print("Hello world")
        return Response(
            {"ok":"ok"},
            status=status.HTTP_200_OK
        )

    def post(self, request):
        print("Checking serializer")
        serializer = GoogleAuthSerializer(data=request.data)
        print("done serializer")

        serializer.is_valid(raise_exception=True)
        print(" serializer valid")

        token = serializer.validated_data["id_token"]
        role = serializer.validated_data["role"]

        try:
            # Verify the token and get user info
            id_info = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

            # id_info contents example:
            # { 'iss': 'https://accounts.google.com', 'sub': '107...','email': 'user@example.com', 'email_verified': True, 'name': '...', 'picture': '...' }

            if id_info.get('iss') not in ['accounts.google.com', 'https://accounts.google.com']:
                return Response({"detail": "Wrong issuer."}, status=status.HTTP_400_BAD_REQUEST)

            google_sub = id_info.get('sub')
            email = id_info.get('email')
            email_verified = id_info.get('email_verified', False)
            name = id_info.get('name', '')
            picture = id_info.get('picture', '')

            if not email:
                return Response({"detail": "Google token did not contain an email."}, status=status.HTTP_400_BAD_REQUEST)

            # Find or create user
            try:
                user = USER.objects.get(email__iexact=email)
                if user.role and user.role != role:
                    print("Role mismatch. You already registered")
                    return Response(
                        {"detail": f"Role mismatch. You already registered as {user.role}"},
                        status=status.HTTP_400_BAD_REQUEST
        )
                # Optionally, link google_sub if not present
                if not getattr(user, 'google_sub', None):
                    user.google_sub = google_sub
                    user.is_email_verified = user.is_email_verified or email_verified
                    user.save(update_fields=['google_sub', 'is_email_verified'])
            except USER.DoesNotExist:
                # Create a new user. You may want to set a unusable password.
                user = USER.objects.create(
                    username = email.split('@')[0] if not getattr(USER._meta, 'USERNAME_FIELD', None) else email,
                    email = email,
                    is_email_verified = email_verified,
                    google_sub = google_sub,
                    role = role
                )

                print(user)
                print(role)
                user.set_unusable_password()
                user.save()

            # Create JWT tokens (Simple JWT)
            refresh = RefreshToken.for_user(user)
            refresh['role'] = user.role
            refresh['email'] = user.email
            refresh.access_token['role'] = user.role
            refresh.access_token['email'] = user.email
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                }
            }
            return Response(data)

        except ValueError:
            # Token invalid
            print(f"detail: Invalid token ")

            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            print(f"detail: {str(exc)}")
            return Response({"detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)









# ------------------------------------------------
#-----------------admin--------------------------
# -----------------------------------------------


class AdminUserListView(ListAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AdminUserListSerializer
    queryset = USER.objects.all()

    filter_backends = [SearchFilter, OrderingFilter]

    search_fields = [
        "email",
        "username",
    ]

    ordering_fields = [
        "email",
        "username",
        "role",
        "is_active",
    ]

    ordering = ["-date_joined"]



class AdminUserDetailView(RetrieveAPIView):
    """
    GET /api/admin/users/<id>/
    """
    serializer_class = AdminUserDetailSerializer
    permission_classes = [IsAdmin]
    queryset = USER.objects.all()
