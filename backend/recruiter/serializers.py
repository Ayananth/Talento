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



class AdminRecruiterListSerializer(serializers.ModelSerializer):
    request_type = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username')
    class Meta:
        model = RecruiterProfile
        fields = [
            "id",
            "username",
            "company_name",
            "industry",
            "status",
            "pending_data",
            "draft_logo",
            "draft_business_registration_doc",
            "rejection_reason",
            "verified_at",
            "created_at",
            "updated_at",
            "request_type"
        ]
    def get_request_type(self, obj):
        if obj.is_first_submission():
            return "New"
        elif obj.is_editing():
            return "Edit"
        return None



class RecruiterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterProfile
        fields = [
            "id",
            "company_name",
            "website",
            "logo",                     
            "about_company",            
            "industry",
            "company_size",
            "location",
            "address",
            "phone",
            "support_email",
            "linkedin",
            "facebook",
            "twitter",
            "business_registration_doc",  
            "verified_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = (
            "id",
            "verified_at",
            "created_at",
            "updated_at",
        )