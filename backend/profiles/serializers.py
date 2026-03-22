import re
from pathlib import Path

from django.contrib.auth import get_user_model
from rest_framework import serializers


from .models import (
    JobSeekerProfile,
    JobSeekerSkill,
    JobSeekerExperience,
    JobSeekerEducation,
    JobSeekerLanguage,
    JobSeekerAccomplishment,
    JobSeekerResume,
)

User = get_user_model()
ALLOWED_PDF_MIME_TYPES = {
    "application/pdf",
    "application/x-pdf",
    "application/octet-stream",
}
MIN_NOTICE_PERIOD_DAYS = 0
MAX_NOTICE_PERIOD_DAYS = 365


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "role", "username"]  # add full_name if in model


class JobSeekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerProfile
        fields = [
            "fullname",
            "headline",
            "bio",
            "experience_years",
            "address",
            "dob",
            "marital_status",
            "current_salary",
            "open_to_work",
            "show_contact",
            "last_updated",
            "phone_number",
            "notice_period",
            "profile_image"
        ]
    def get_profile_image(self, obj):
        if obj.profile_image:
            return obj.profile_image.url
        return None

    def validate_notice_period(self, value):
        if value is None:
            return value

        notice_period = value.strip()
        if not notice_period:
            return notice_period

        if re.match(r"^-\s*\d+", notice_period):
            raise serializers.ValidationError("Notice period cannot be negative.")

        match = re.search(r"\d+", notice_period)
        if not match:
            raise serializers.ValidationError(
                "Notice period must include a number (for example: 30 days)."
            )

        notice_days = int(match.group())
        if not (MIN_NOTICE_PERIOD_DAYS <= notice_days <= MAX_NOTICE_PERIOD_DAYS):
            raise serializers.ValidationError(
                f"Notice period must be between {MIN_NOTICE_PERIOD_DAYS} and {MAX_NOTICE_PERIOD_DAYS} days."
            )

        return notice_period

class JobSeekerSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerSkill
        fields = ["id", "skill_name"]


class JobSeekerExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerExperience
        fields = [
            "id",
            "company",
            "role",
            "description",
            "start_date",
            "end_date",
        ]


class JobSeekerEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerEducation
        fields = [
            "id",
            "degree",
            "institution",
            "start_date",
            "end_date",
        ]


class JobSeekerLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerLanguage
        fields = [
            "id",
            "language",
            "proficiency",
            "read",
            "write",
            "speak",
        ]


class JobSeekerAccomplishmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerAccomplishment
        fields = ["id", "type", "link"]


class JobSeekerResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerResume
        fields = [
            "id",
            "title",
            "file",
            "uploaded_at",
            "parsed_data",
            "is_default",
            "is_deleted",
            "status",
            "parsing_error",
        ]

    def validate_file(self, value):
        if not value:
            raise serializers.ValidationError("Resume file is required.")

        file_name = (getattr(value, "name", "") or "").strip()
        content_type = (getattr(value, "content_type", "") or "").lower()
        extension = Path(file_name).suffix.lower()

        if extension != ".pdf":
            raise serializers.ValidationError("Only PDF resumes are accepted.")

        if content_type and content_type not in ALLOWED_PDF_MIME_TYPES:
            raise serializers.ValidationError(
                "Invalid resume MIME type. Please upload a valid PDF file."
            )

        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Resume size should be less than 2 MB.")

        return value

    def create(self, validated_data):
        profile = self.context["profile"]

        # Force correct profile (ignore client input if any)
        validated_data["profile"] = profile

        # Auto set default resume if first one
        has_resume = JobSeekerResume.objects.filter(profile=profile).exists()
        validated_data["is_default"] = not has_resume

        return JobSeekerResume.objects.create(**validated_data)





class FullJobSeekerProfileSerializer(serializers.Serializer):
    user = UserBasicSerializer()
    profile = JobSeekerProfileSerializer()
    skills = JobSeekerSkillSerializer(many=True)
    experience = JobSeekerExperienceSerializer(many=True)
    education = JobSeekerEducationSerializer(many=True)
    languages = JobSeekerLanguageSerializer(many=True)
    accomplishments = JobSeekerAccomplishmentSerializer(many=True)
    resumes = JobSeekerResumeSerializer(many=True)
