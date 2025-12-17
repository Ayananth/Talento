from rest_framework import serializers
from jobs.models.job import Job
from jobs.models.application import JobApplication
from jobs.models.skill import JobSkill
from django.utils import timezone



from rest_framework import serializers
from django.utils import timezone
from jobs.models.job import Job
from jobs.models.skill import JobSkill

from datetime import timedelta






class RecruiterJobSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True
    )

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
            "salary_min",
            "salary_max",
            "salary_currency",
            "salary_hidden",
            "openings",
            "skills",
            "expires_at",
        ]

    # -------------------------------
    # VALIDATION
    # -------------------------------
    def validate(self, data):
        salary_min = data.get("salary_min")
        salary_max = data.get("salary_max")
        expires_at = data.get("expires_at")

        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError(
                "salary_min cannot be greater than salary_max"
            )

        if expires_at and expires_at <= timezone.now():
            raise serializers.ValidationError(
                "expires_at must be a future date"
            )

        return data

    # -------------------------------
    # CREATE
    # -------------------------------
    def create(self, validated_data):
        skills_data = validated_data.pop("skills", [])

        # 👇 IMPORTANT: NO recruiter, status, published_at here
        job = Job.objects.create(**validated_data)

        self._save_skills(job, skills_data)
        return job

    # -------------------------------
    # UPDATE
    # -------------------------------
    def update(self, instance, validated_data):
        skills_data = validated_data.pop("skills", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if skills_data is not None:
            instance.skills.clear()
            self._save_skills(instance, skills_data)

        return instance

    # -------------------------------
    # HELPER
    # -------------------------------
    def _save_skills(self, job, skills_data):
        for skill_name in skills_data:
            skill, _ = JobSkill.objects.get_or_create(
                name=skill_name.strip().lower()
            )
            job.skills.add(skill)


class JobCreateSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Job
        fields = [
            "title",
            "description",
            "job_type",
            "work_mode",
            "experience_level",
            "location_city",
            "location_state",
            "location_country",
            "salary_min",
            "salary_max",
            "salary_currency",
            "salary_hidden",
            "openings",
            "skills",
            "expires_at",
        ]

    def validate(self, data):
        salary_min = data.get("salary_min")
        salary_max = data.get("salary_max")

        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError(
                "salary_min cannot be greater than salary_max"
            )

        return data

    def create(self, validated_data):
        skills_data = validated_data.pop("skills", [])
        recruiter = self.context["request"].user

        job = Job.objects.create(
            recruiter=recruiter,
            status=Job.Status.DRAFT,
            **validated_data
        )

        for skill_name in skills_data:
            skill, _ = JobSkill.objects.get_or_create(
                name=skill_name.strip().lower()
            )
            job.skills.add(skill)

        return job



class JobPublishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = []

    def validate(self, attrs):
        if self.instance.status != Job.Status.DRAFT:
            raise serializers.ValidationError(
                "Only draft jobs can be published."
            )
        return attrs




class RecruiterJobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "status",
            "job_type",
            "work_mode",
            "experience_level",
            "location_city",
            "location_country",
            "created_at",
            "published_at",
            "expires_at",
            "view_count",
            "is_active"

        ]


class JobUpdateSerializer(JobCreateSerializer):
    """
    Same fields as create,
    but used only for updating draft jobs.
    """
    pass


class JobCloseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = []

    def validate(self, attrs):
        if self.instance.status == Job.Status.CLOSED:
            raise serializers.ValidationError(
                "Job is already closed."
            )
        return attrs
    


class PublicJobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "job_type",
            "work_mode",
            "experience_level",
            "location_city",
            "location_country",
            "salary_min",
            "salary_max",
            "salary_currency",
            "published_at",
        ]


class PublicJobDetailSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

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
            "salary_min",
            "salary_max",
            "salary_currency",
            "published_at",
            "skills",
        ]

    def get_skills(self, obj):
        return [skill.name for skill in obj.skills.all()]




# =========================================
# application
# ====================================




class JobApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ["resume", "cover_letter"]

    def validate(self, attrs):
        job = self.context["job"]
        user = self.context["request"].user

        if job.status != Job.Status.PUBLISHED:
            raise serializers.ValidationError("This job is not accepting applications.")

        if job.expires_at and job.expires_at <= timezone.now():
            raise serializers.ValidationError("This job has expired.")

        if JobApplication.objects.filter(job=job, applicant=user).exists():
            raise serializers.ValidationError("You have already applied to this job.")

        return attrs

    def create(self, validated_data):
        job = self.context["job"]
        user = self.context["request"].user

        return JobApplication.objects.create(
            job=job,
            applicant=user,
            **validated_data
        )
