from authentication.models import UserModel
from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer




USER = get_user_model()

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

