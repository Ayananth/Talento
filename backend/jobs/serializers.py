from rest_framework import serializers
from jobs.models.job import Job
from jobs.models.skill import JobSkill


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
        ]