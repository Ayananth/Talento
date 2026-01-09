from rest_framework import serializers
from .models import JobApplication
from jobs.models.job import Job
import re
from cloudinary.utils import cloudinary_url


DANGEROUS_PATTERN = re.compile(
    r"(<script|</script>|<.*?>|javascript:|onerror=|onload=)",
    re.IGNORECASE,
)



class ApplyJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "job",
            "resume",
            "cover_letter",
            "current_salary",
            "expected_salary",
            "notice_period",
        ]

    def validate_expected_salary(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Expected salary must be greater than zero."
            )
        return value

    def validate_notice_period(self, value):
        if not value:
            return value

        if len(value) > 50:
            raise serializers.ValidationError(
                "Notice period value is too long."
            )
        return value

    def validate_job(self, job):
        request = self.context["request"]
        profile = request.user.jobseeker_profile

        if job.status != Job.Status.PUBLISHED:
            raise serializers.ValidationError("This job is not open for applications.")

        if JobApplication.objects.filter(
            job=job,
            applicant=profile
        ).exists():
            raise serializers.ValidationError(
                "You have already applied for this job."
            )

        return job

    def validate_resume(self, file):
        if not file:
            return file

        allowed_types = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]

        if file.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only PDF or DOCX resumes are allowed."
            )

        if file.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "Resume size should be less than 5 MB."
            )

        return file
    
    def validate_cover_letter(self, value):
        if not value:
            return value

        if DANGEROUS_PATTERN.search(value):
            raise serializers.ValidationError(
                "Cover letter contains unsafe content."
            )

        return value

    


class JobApplicationSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(
        source="job.recruiter.company_name",
        read_only=True
    )

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "status",
            "resume_url",
            "cover_letter",
            "applied_at",
            "updated_at",
        ]

    def get_resume_url(self, obj):
        if not obj.resume:
            return None

        url, _ = cloudinary_url(
            obj.resume,
            resource_type="image"
        )
        return url


class JobApplicationListSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)

    company_name = serializers.SerializerMethodField()

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True
    )
    salary = serializers.SerializerMethodField()
    job_type = serializers.SerializerMethodField()
    location_city = serializers.CharField(
        source="job.location_city",
        read_only=True
    )
    location_state = serializers.CharField(
        source="job.location_state",
        read_only=True
    )
    location_country = serializers.CharField(
        source="job.location_country",
        read_only=True
    )

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "status",
            "status_display",
            "cover_letter",
            "applied_at",
            "updated_at",
            "salary",
            "job_type",
            "location_city",
            "location_state",
            "location_country",
        ]

    def get_company_name(self, obj):
        recruiter = obj.job.recruiter
        return getattr(recruiter.recruiter_profile, "company_name", None)

    def get_salary(self, obj):
        job = obj.job
        if job.salary_min and job.salary_max:
            return f"{job.salary_currency} {job.salary_min} - {job.salary_max}"
        elif job.salary_min:
            return f"{job.salary_currency} {job.salary_min}+"
        elif job.salary_max:
            return f"{job.salary_currency} up to {job.salary_max}"
        else:
            return "Not specified"
    
    def get_job_type(self, obj):
        job = obj.job
        return job.job_type
    

class RecruiterApplicationListSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)

    applicant_name = serializers.CharField(
        source="applicant.fullname",
        read_only=True
    )
    applicant_email = serializers.EmailField(
        source="applicant.user.email",
        read_only=True
    )
    phone = serializers.CharField(
        source="applicant.phone_number",
        read_only=True
    )

    expected_salary = serializers.IntegerField(read_only=True)
    current_salary = serializers.IntegerField(read_only=True)
    notice_period = serializers.CharField(read_only=True)
    location = serializers.SerializerMethodField()

    skills = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="skill_name",
        source="applicant.skills"
    )   
    
    experience_years = serializers.IntegerField(
        source="applicant.experience_years",
        read_only=True
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True
    )

    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job",
            "job_title",
            "applicant_name",
            "applicant_email",
            "expected_salary",
            "current_salary",
            "notice_period",
            "status",
            "status_display",
            "resume_url",
            "applied_at",
            "phone",
            "location",
            "experience_years",
            "skills"
        ]

    def get_resume_url(self, obj):
        return obj.resume.url if obj.resume else None
    
    def get_location(self, obj):
        job = obj.job
        parts = [
            job.location_city,
            # job.location_state,
            # job.location_country,
        ]
        return ", ".join(filter(None, parts))

class RecruiterApplicationDetailSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="applicant.fullname", read_only=True)
    email = serializers.EmailField(source="applicant.user.email", read_only=True)
    phone = serializers.CharField(source="applicant.phone", allow_null=True)
    experience = serializers.IntegerField(
        source="applicant.experience_years",
        read_only=True
    )
    current_role = serializers.CharField(
        source="applicant.current_role",
        allow_null=True,
        required=False
    )
    summary = serializers.CharField(
        source="applicant.summary",
        allow_blank=True,
        required=False
    )

    applicant_id = serializers.IntegerField(source="applicant.user.id", read_only=True)

    jobTitle = serializers.CharField(source="job.title", read_only=True)
    status = serializers.CharField()
    applied_date = serializers.DateTimeField(source="applied_at", read_only=True)

    expected_salary = serializers.IntegerField()
    current_salary = serializers.IntegerField(allow_null=True)
    notice_period = serializers.CharField(allow_blank=True)

    resume_url = serializers.SerializerMethodField()
    cover_letter = serializers.CharField(allow_blank=True)

    skills = serializers.SerializerMethodField()

    recruiter_notes = serializers.CharField(
        allow_blank=True,
        required=False
    )

    class Meta:
        model = JobApplication
        fields = [
            "id",

            "name",
            "email",
            "phone",
            "experience",
            "current_role",
            "summary",

            "jobTitle",
            "status",
            "applied_date",
            "job_id",

            "expected_salary",
            "current_salary",
            "notice_period",

            "resume_url",
            "skills",
            "cover_letter",

            "recruiter_notes",
            "applicant_id"
        ]

    def get_resume_url(self, obj):
        return obj.resume.url if obj.resume else None

    def get_skills(self, obj):
        """
        Assumes applicant.skills is ManyToManyField
        """
        return list(
            obj.applicant.skills.values_list("skill_name", flat=True)
        )
    

class UpdateApplicationStatusSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(
        choices=JobApplication.Status.choices
    )
    recruiter_notes = serializers.CharField(
        allow_blank=True,
        required=False
    )

    class Meta:
        model = JobApplication
        fields = [
            "status",
            "recruiter_notes",
        ]


