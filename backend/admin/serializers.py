from rest_framework import serializers
from jobs.models.job import Job
from jobs.models.application import JobApplication
from jobs.models.skill import JobSkill
from django.utils import timezone


class AdminJobListSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='recruiter.email')
    company = serializers.CharField(source='recruiter.recruiter_profile.company_name')

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "status",
            "published_at",
            "expires_at",
            "email",
            "company"
        ]


class AdminJobDetailSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()
    email = serializers.CharField(source="recruiter.email")
    company = serializers.CharField(source="recruiter.recruiter_profile.company_name")
    location = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "job_type",
            "work_mode",
            "experience_level",
            "location_city",
            "location_state",
            "location_country",
            "location",
            "salary_min",
            "salary_max",
            "salary_currency",
            "published_at",
            "skills",
            "email",
            "company",
            "expires_at",
            "created_at",
        ]

    def get_skills(self, obj):
        return [skill.name for skill in obj.skills.all()]

    def get_location(self, obj):
        parts = [
            obj.location_city,
            obj.location_state,
            obj.location_country,
        ]
        return ", ".join([p for p in parts if p])
