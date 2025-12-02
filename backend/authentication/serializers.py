from authentication.models import UserModel
from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str





USER = get_user_model()
token_generator = PasswordResetTokenGenerator()

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password_confirmed = serializers.CharField(write_only=True)

    class Meta:
        model = USER
        fields = ("email", "password", "password_confirmed", "user_type")
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
            email=validated_data["email"],
            user_type=validated_data.get("user_type", "jobseeker"),
            is_active=False,
            is_email_verified=False,
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
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
