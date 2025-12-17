from authentication.models import UserModel
from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed


from profiles.models import JobSeekerProfile
from recruiter.models import RecruiterProfile






USER = get_user_model()
token_generator = PasswordResetTokenGenerator()

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password_confirmed = serializers.CharField(write_only=True)

    class Meta:
        model = USER
        fields = ("email","username", "password", "password_confirmed", "role")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):

        if attrs["password"] != attrs["password_confirmed"]:
            raise serializers.ValidationError(
                {"password_confirmed": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirmed")
        user = USER(
            username = validated_data["username"],
            email=validated_data["email"],
            role=validated_data.get("role", "jobseeker"),
            is_active=False,
            is_email_verified=False,
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        requested_role = self.context['request'].data.get("role")
        data = super().validate(attrs)
        user = self.user
        if requested_role and user.role != requested_role:
            raise AuthenticationFailed("Invalid credentials")
        refresh = self.get_token(user)
        # data['refresh'] = str(refresh)
        # data['access'] = str(refresh.access_token)
        access = str(refresh.access_token)
        # data['role'] = user.role
        # data['email'] = user.email
        return {
            'access': access
        }
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token["email"] = user.email
        return token
    

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        uid = attrs.get("uid")
        token = attrs.get("token")
        password = attrs.get("password")

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = USER.objects.get(pk=user_id)
        except Exception:
            raise serializers.ValidationError({"uid": "Invalid UID"})

        # validate token
        if not token_generator.check_token(user, token):
            raise serializers.ValidationError({"token": "Invalid or expired token"})

        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data["user"]
        password = self.validated_data["password"]

        user.set_password(password)
        user.save()

        return user
    
class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=["jobseeker", "recruiter"])














#------------------- Admin----------------------






class AdminUserListSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = USER
        fields = [
            "id",
            "email",
            "username",
            "role",
            "role_display",
            "is_active",
            "is_staff",
            "is_superuser",
            "is_email_verified",
            "is_blocked"

        ]






class JobSeekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerProfile
        fields = [
            "fullname",
            "headline",
            "experience_years",
            "open_to_work",
        ]


class RecruiterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterProfile
        fields = [
            "company_name",
            "status",
            "verified_at",
        ]


class AdminUserDetailSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)

    jobseeker_profile = JobSeekerProfileSerializer(read_only=True)
    recruiter_profile = RecruiterProfileSerializer(read_only=True)

    class Meta:
        model = USER
        fields = [
            "id",
            "email",
            "username",
            "role",
            "role_display",
            "is_active",
            "is_email_verified",
            "is_staff",
            "date_joined",
            "last_login",

            "jobseeker_profile",
            "recruiter_profile",
        ]


