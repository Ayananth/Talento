from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from core.permissions import IsJobseeker
import cloudinary.uploader
from rest_framework.parsers import MultiPartParser, FormParser

from .models import (
    JobSeekerProfile,
    JobSeekerSkill,
    JobSeekerExperience,
    JobSeekerEducation,
    JobSeekerLanguage,
    JobSeekerAccomplishment,
    JobSeekerResume,
)
from .serializers import FullJobSeekerProfileSerializer,  JobSeekerProfileUpdateSerializer


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




class JobSeekerProfileImageView(APIView):
    permission_classes = [IsJobseeker]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        profile = request.user.jobseeker_profile
        file = request.FILES.get("profile_image")

        if not file:
            return Response({"error": "No image uploaded"}, status=400)

        # delete old image
        if profile.profile_image:
            try:
                cloudinary.uploader.destroy(profile.profile_image.public_id)
            except:
                pass

        upload_result = cloudinary.uploader.upload(
            file,
            folder=f"talento-dev/profile_pics/jobseeker/",
            overwrite=True,
            resource_type="image"
        )

        # Save Cloudinary result into model field
        profile.profile_image = upload_result["public_id"]
        profile.save()

        return Response({
            "message": "Profile image updated successfully",
            "profile_image": upload_result["secure_url"],
        }, status=200)
    def delete(self, request):
        """Delete profile image."""
        profile = request.user.jobseeker_profile

        if not profile.profile_image:
            return Response({"error": "No profile image exists"}, status=404)

        # Delete Cloudinary image
        try:
            cloudinary.uploader.destroy(profile.profile_image.public_id)
        except:
            pass

        profile.profile_image = None
        profile.save()

        return Response({"message": "Profile image deleted"}, status=200)




class JobSeekerProfileUpdateView(APIView):
    permission_classes = [IsJobseeker]

    def patch(self, request):
        user = request.user

        try:
            profile = JobSeekerProfile.objects.get(user=user)
        except JobSeekerProfile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = JobSeekerProfileUpdateSerializer(
            profile, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully", "profile": serializer.data})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
