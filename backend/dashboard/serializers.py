from rest_framework import serializers
from jobs.models.job import Job
from jobs.models.skill import JobSkill
from django.utils import timezone
from subscriptions.models import UserSubscription


class TransactionListSerializer(serializers.ModelSerializer):
    transaction_id = serializers.CharField(
        source="razorpay_payment_id"
    )
    user_id = serializers.IntegerField(
        source="user.id"
    )
    user_name = serializers.SerializerMethodField()
    
    user_email = serializers.EmailField(
        source="user.email"
    )
    user_type = serializers.CharField(
        source="plan.plan_type"
    )
    plan_name = serializers.CharField(
        source="plan.name"
    )
    duration_months = serializers.IntegerField(
        source="plan.duration_months"
    )
    amount = serializers.IntegerField(
        source="plan.price"
    )

    class Meta:
        model = UserSubscription
        fields = [
            "transaction_id",
            "user_id",
            "user_name",
            "user_email",
            "user_type",
            "plan_name",
            "amount",
            "duration_months",
            "status",
            "created_at",
        ]

    def get_user_name(self, obj):
        try:
            if obj.plan.plan_type == "jobseeker":
                return obj.user.jobseeker_profile.fullname
            elif obj.plan.plan_type == "recruiter":
                return obj.user.recruiter_profile.company_name
        except AttributeError:
            pass

        return ""


class AdminJobListSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='recruiter.user.email')
    company = serializers.CharField(source='recruiter.company_name')

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
    email = serializers.CharField(source="recruiter.user.email")
    company = serializers.CharField(source="recruiter.company_name")
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
            "status"
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
