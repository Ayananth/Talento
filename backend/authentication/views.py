from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view #for FBV, remove if not used
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
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

from .utils import generate_email_verification_token
from .tasks import send_verification_email

USER = get_user_model()


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
                return Response({"message": "Account already verified"})

            # Activate the user
            user.is_active = True
            user.save()

            return Response({"message": "Email verified successfully!"})

        except Exception as e:
            return Response({"error": str(e)}, status=400)
        



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




# @api_view(['POST'])
# def SignUpView(request):
#     # Deserialize the incoming data using the UserSerializer
#     serializer = UserSerializer(data=request.data)
    
#     # Validate the data
#     if serializer.is_valid():
#         try:
#             # Create the user
#             user = serializer.save()

#             # Return a success response
#             return Response({
#                 "message": "User created successfully.",
#                 "user": {
#                     "email": user.email
#                 }
#             }, status=status.HTTP_201_CREATED)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#     else:
#         # If validation fails, return errors
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.http import HttpResponse

def test(request):
    return HttpResponse("Hello, World!", content_type="text/plain")



    
