from rest_framework import serializers
from jobs.models.job import Job
# from jobs.models.application import JobApplication
from jobs.models.skill import JobSkill
from django.utils import timezone



from rest_framework import serializers
from django.utils import timezone
from jobs.models.job import Job, SavedJob
from jobs.models.skill import JobSkill

from datetime import timedelta
from cloudinary.utils import cloudinary_url






class TopRecruiterStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    company_name = serializers.CharField(allow_null=True)
    location = serializers.CharField(allow_null=True)
    job_count = serializers.IntegerField()
    logo = serializers.SerializerMethodField()

    def get_logo(self, obj):
        logo = obj.get("logo")
        if not logo:
            return None
        try:
            return logo.url
        except Exception:
            return None



def _validate_experience_and_deadline(serializer, data):
    experience = data.get("experience")
    application_deadline = data.get("application_deadline")

    if experience is not None and experience < 0:
        raise serializers.ValidationError(
            {"experience": "Experience cannot be negative."}
        )

    if application_deadline is not None:
        posted_at = data.get("published_at")
        if posted_at is None and serializer.instance is not None:
            posted_at = serializer.instance.published_at
        if posted_at is None:
            posted_at = timezone.now()

        if application_deadline < posted_at:
            raise serializers.ValidationError(
                {
                    "application_deadline": (
                        "Application deadline cannot be before the posted date."
                    )
                }
            )


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
            "responsibilities",
            "requirements",
            "education_requirement",
            "job_type",
            "work_mode",
            "experience",
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
            "application_deadline",
            "expires_at",
        ]

    # -------------------------------
    # VALIDATION
    # -------------------------------
    def validate(self, data):
        salary_min = data.get("salary_min")
        salary_max = data.get("salary_max")
        expires_at = data.get("expires_at")

        _validate_experience_and_deadline(self, data)

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





class RecruiterJobDetailSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "responsibilities",
            "requirements",
            "education_requirement",
            "job_type",
            "work_mode",
            "experience",
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
            "status",
            "is_active",
            "published_at",
            "application_deadline",
            "expires_at",
            "created_at",
            "view_count",
        ]

    def get_skills(self, obj):
        return [s.name for s in obj.skills.all()]




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
            "responsibilities",
            "requirements",
            "education_requirement",
            "job_type",
            "work_mode",
            "experience",
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
            "application_deadline",
            "expires_at",
        ]

    def validate(self, data):
        salary_min = data.get("salary_min")
        salary_max = data.get("salary_max")

        _validate_experience_and_deadline(self, data)

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
    applications_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "status",
            "experience",
            "job_type",
            "work_mode",
            "experience_level",
            "location_city",
            "location_country",
            "created_at",
            "published_at",
            "application_deadline",
            "expires_at",
            "view_count",
            "is_active",
            "applications_count"

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
    logo = serializers.SerializerMethodField()
    company_name = serializers.CharField(source = 'recruiter.company_name')
    has_applied = serializers.BooleanField(read_only=True)
    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "responsibilities",
            "requirements",
            "education_requirement",
            "job_type",
            "work_mode",
            "experience",
            "experience_level",
            "location_city",
            "location_country",
            "salary_min",
            "salary_max",
            "salary_currency",
            "published_at",
            "application_deadline",
            "logo",
            'company_name',
            "has_applied",
            "recruiter_id"

        ]

    def get_logo(self, obj):
        recruiter = getattr(obj, "recruiter", None)
        if recruiter and recruiter.logo:
            try:
                return recruiter.logo.url
            except Exception:
                return None
        return None



class PublicJobDetailSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    company_name = serializers.CharField(source = 'recruiter.company_name')
    company_about = serializers.CharField(source = 'recruiter.about_company')
    company_size = serializers.CharField(source = 'recruiter.company_size')
    company_website = serializers.URLField(source = 'recruiter.website')
    has_applied = serializers.BooleanField(read_only=True)
    is_saved = serializers.BooleanField(read_only=True)


    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "responsibilities",
            "requirements",
            "education_requirement",
            "job_type",
            "work_mode",
            "experience",
            "experience_level",
            "location_city",
            "location_state",
            "location_country",
            "salary_min",
            "salary_max",
            "salary_currency",
            "published_at",
            "application_deadline",
            "skills",
            "logo",
            "company_name",
            "company_about",
            "company_size",
            "company_website",
            "has_applied",
            "recruiter_id",
            "is_saved",

        ]

    def get_logo(self, obj):
        recruiter_profile = getattr(obj.recruiter, "recruiter_profile", None)
        if recruiter_profile and recruiter_profile.logo:
            return recruiter_profile.logo.url
        return None


    def get_skills(self, obj):
        return [skill.name for skill in obj.skills.all()]

class SavedJobListSerializer(serializers.ModelSerializer):
    job = PublicJobListSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = [
            "id",
            "created_at",
            "job",
        ]



class SavedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJob
        fields = ["id", "job", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_job(self, job):
        if not job.is_active or job.status != "published":
            raise serializers.ValidationError("This job cannot be saved.")
        return job




# =========================================
# application
# ====================================




# class JobApplySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = JobApplication
#         fields = ["resume", "cover_letter"]

#     def validate(self, attrs):
#         job = self.context["job"]
#         user = self.context["request"].user

#         if job.status != Job.Status.PUBLISHED:
#             raise serializers.ValidationError("This job is not accepting applications.")

#         if job.expires_at and job.expires_at <= timezone.now():
#             raise serializers.ValidationError("This job has expired.")

#         if JobApplication.objects.filter(job=job, applicant=user).exists():
#             raise serializers.ValidationError("You have already applied to this job.")

#         return attrs

#     def create(self, validated_data):
#         job = self.context["job"]
#         user = self.context["request"].user

#         return JobApplication.objects.create(
#             job=job,
#             applicant=user,
#             **validated_data
#         )
