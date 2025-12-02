from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view #for FBV, remove if not used
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, PasswordResetRequestSerializer, UserSerializer
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



from .utils import generate_email_verification_token
from .tasks import send_verification_email, send_password_reset_email_task

USER = get_user_model()
token_generator = PasswordResetTokenGenerator()



class SignUpView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = USER.objects.get(email=email)
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

        try:
            access_token = AccessToken(token)

            # Ensure it is an email verification token
            if not access_token.get("email_verification", False):
                return Response({"error": "Invalid token type"}, status=400)

            user_id = access_token["user_id"]
            user = USER.objects.get(id=user_id)

            if user.is_active:
                return redirect(settings.FRONTEND_URL + settings.EMAIL_VERIFICATION_SUCCESS_URL)

            # Activate the user
            user.is_active = True
            user.save()

            return redirect(settings.FRONTEND_URL + settings.EMAIL_VERIFICATION_SUCCESS_URL)

        except Exception as e:
            return redirect(settings.FRONTEND_URL + settings.EMAIL_VERIFICATION_FAILED_URL)
        



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



