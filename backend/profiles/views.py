from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from core.permissions import IsJobseeker

from .models import (
    JobSeekerProfile,
    JobSeekerSkill,
    JobSeekerExperience,
    JobSeekerEducation,
    JobSeekerLanguage,
    JobSeekerAccomplishment,
    JobSeekerResume,
)
from .serializers import FullJobSeekerProfileSerializer


class JobSeekerProfileView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        user = request.user

        print("Profile data request received")

        if user.role != "jobseeker":
            return Response(
                {"error": "Access denied. Only jobseekers can access this."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            profile = JobSeekerProfile.objects.select_related().get(user=user)
        except JobSeekerProfile.DoesNotExist:
            return Response(
                {"error": "Profile does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        skills = JobSeekerSkill.objects.filter(profile=profile)
        experience = JobSeekerExperience.objects.filter(profile=profile)
        education = JobSeekerEducation.objects.filter(profile=profile)
        languages = JobSeekerLanguage.objects.filter(profile=profile)
        accomplishments = JobSeekerAccomplishment.objects.filter(profile=profile)
        resumes = JobSeekerResume.objects.filter(profile=profile)

        data = {
            "user": user,
            "profile": profile,
            "skills": skills,
            "experience": experience,
            "education": education,
            "languages": languages,
            "accomplishments": accomplishments,
            "resumes": resumes,
        }

        serializer = FullJobSeekerProfileSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
