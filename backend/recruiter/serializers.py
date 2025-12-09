from rest_framework import serializers
from .models import RecruiterProfile


class RecruiterDraftCreateSerializer(serializers.Serializer):
    """
    Used when recruiter submits company profile details for the first time
    (or completely overwrites the existing draft).
    """

    company_name = serializers.CharField(required=True)
    website = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    industry = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    company_size = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    about_company = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    support_email = serializers.EmailField(required=False, allow_null=True)
    location = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    linkedin = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    facebook = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    twitter = serializers.CharField(required=False, allow_blank=True, allow_null=True)


    # File fields (draft) – CloudinaryFields on the model
    draft_logo = serializers.ImageField(required=False, allow_null=True)
    draft_business_registration_doc = serializers.FileField(required=False, allow_null=True)