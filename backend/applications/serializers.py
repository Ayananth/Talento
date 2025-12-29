from rest_framework import serializers
from .models import JobApplication
from jobs.models.job import Job



class ApplyJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "job",
            "resume",
            "cover_letter",
        ]

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
        return obj.resume.url if obj.resume else None
