from rest_framework import serializers
from .models import RecruiterProfile

from .utils.cloudinary import generate_signed_raw_url

class RecruiterDraftCreateSerializer(serializers.Serializer):
    """
    Used when recruiter submits company profile details for the first time
    """

    company_name = serializers.CharField(required=True, max_length=255)
    website = serializers.URLField(required=False, allow_null=True)
    industry = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    company_size = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    about_company = serializers.CharField(
        required=False, allow_blank=True, allow_null=True
    )

    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    support_email = serializers.EmailField(required=True)

    location = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    linkedin = serializers.URLField(required=False, allow_null=True)
    facebook = serializers.URLField(required=False, allow_null=True)
    twitter = serializers.URLField(required=False, allow_null=True)

    # Draft file fields
    draft_logo = serializers.ImageField(required=False, allow_null=True)
    draft_business_registration_doc = serializers.FileField(
        required=False, allow_null=True
    )

    # -------------------- Field-level validations --------------------

    def validate_about_company(self, value):
        if value and len(value.strip()) < 30:
            raise serializers.ValidationError(
                "Company description must be at least 30 characters."
            )
        return value

    def validate_phone(self, value):
        if value:
            digits = "".join(filter(str.isdigit, value))
            if len(digits) < 10:
                raise serializers.ValidationError("Invalid phone number.")
        return value

    def validate_draft_logo(self, file):
        if file:
            if file.size > 2 * 1024 * 1024:
                raise serializers.ValidationError(
                    "Logo size must be less than 2MB."
                )
        return file

    def validate_draft_business_registration_doc(self, file):
        if file:
            if file.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "Document size must be less than 5MB."
                )
        return file

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
        else:
            return "Edit"




class RecruiterProfileSerializer(serializers.ModelSerializer):
    has_published_data = serializers.SerializerMethodField()

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
            "draft_business_registration_doc",  
            "business_registration_doc",  
            "verified_at",
            "created_at",
            "updated_at",
            "rejection_reason",
            "has_published_data",
            "status",
            "pending_data",
        ]
        read_only_fields = (
            "id",
            "verified_at",
            "created_at",
            "updated_at",
        )

    def get_has_published_data(self, obj):
        return obj.has_published_data()
    



class AdminRecruiterDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    email = serializers.CharField(source="user.email")
    request_type = serializers.SerializerMethodField()
    signed_business_doc_url = serializers.SerializerMethodField()
    signed_business_doc_download_url = serializers.SerializerMethodField()

    class Meta:
        model = RecruiterProfile
        fields = "__all__"


    def get_request_type(self, obj):
        if obj.is_first_submission():
            return "New"
        elif obj.is_editing():
            return "Edit"
        return None
    
    def get_signed_business_doc_url(self, obj):
        if not obj.draft_business_registration_doc:
            return None

        return generate_signed_raw_url(
            obj.draft_business_registration_doc.public_id,
            expires_in=300,   # 5 minutes
            force_download=False,
        )

    def get_signed_business_doc_download_url(self, obj):
        if not obj.draft_business_registration_doc:
            return None

        return generate_signed_raw_url(
            obj.draft_business_registration_doc.public_id,
            expires_in=300,
            force_download=True,
        )


    