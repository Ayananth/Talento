from rest_framework import serializers
from django.contrib.auth import get_user_model


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
