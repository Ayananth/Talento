import logging

import cloudinary.uploader

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsJobseeker

from .models import (
    JobSeekerAccomplishment,
    JobSeekerEducation,
    JobSeekerExperience,
    JobSeekerLanguage,
    JobSeekerProfile,
    JobSeekerResume,
    JobSeekerSkill,
)
from .serializers import (
    FullJobSeekerProfileSerializer,
    JobSeekerAccomplishmentSerializer,
    JobSeekerEducationSerializer,
    JobSeekerExperienceSerializer,
    JobSeekerLanguageSerializer,
    JobSeekerProfileSerializer,
    JobSeekerResumeSerializer,
    JobSeekerSkillSerializer,
)

logger = logging.getLogger(__name__)


class JobSeekerProfileView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        logger.info(
            "Jobseeker profile requested",
            extra={"user_id": request.user.id},
        )

        user = request.user

        if user.role != "jobseeker":
            logger.warning(
                "Non-jobseeker attempted to access jobseeker profile",
                extra={"user_id": user.id},
            )
            return Response(
                {"error": "Access denied. Only jobseekers can access this."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            profile = JobSeekerProfile.objects.get(user=user)
        except JobSeekerProfile.DoesNotExist:
            logger.warning(
                "Jobseeker profile not found",
                extra={"user_id": user.id},
            )
            return Response(
                {"error": "Profile does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = {
            "user": user,
            "profile": profile,
            "skills": JobSeekerSkill.objects.filter(profile=profile),
            "experience": JobSeekerExperience.objects.filter(profile=profile),
            "education": JobSeekerEducation.objects.filter(profile=profile),
            "languages": JobSeekerLanguage.objects.filter(profile=profile),
            "accomplishments": JobSeekerAccomplishment.objects.filter(profile=profile),
            "resumes": JobSeekerResume.objects.filter(profile=profile),
        }

        serializer = FullJobSeekerProfileSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class JobSeekerProfileImageView(APIView):
    permission_classes = [IsJobseeker]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        logger.info(
            "Jobseeker profile image update requested",
            extra={"user_id": request.user.id},
        )

        profile = request.user.jobseeker_profile
        file = request.FILES.get("profile_image")

        if not file:
            logger.warning(
                "Profile image missing in upload request",
                extra={"user_id": request.user.id},
            )
            return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        if profile.profile_image:
            try:
                cloudinary.uploader.destroy(profile.profile_image.public_id)
            except Exception:
                logger.exception(
                    "Failed to delete old profile image",
                    extra={"user_id": request.user.id},
                )

        upload_result = cloudinary.uploader.upload(
            file,
            folder="talento-dev/profile_pics/jobseeker/",
            overwrite=True,
            resource_type="image",
        )

        profile.profile_image = upload_result["public_id"]
        profile.save()

        logger.info(
            "Jobseeker profile image updated",
            extra={"user_id": request.user.id},
        )

        return Response(
            {
                "message": "Profile image updated successfully",
                "profile_image": upload_result["secure_url"],
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request):
        logger.info(
            "Jobseeker profile image delete requested",
            extra={"user_id": request.user.id},
        )

        profile = request.user.jobseeker_profile

        if not profile.profile_image:
            logger.warning(
                "No profile image to delete",
                extra={"user_id": request.user.id},
            )
            return Response(
                {"error": "No profile image exists"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            cloudinary.uploader.destroy(profile.profile_image.public_id)
        except Exception:
            logger.exception(
                "Failed to delete profile image from cloudinary",
                extra={"user_id": request.user.id},
            )

        profile.profile_image = None
        profile.save()

        logger.info(
            "Jobseeker profile image deleted",
            extra={"user_id": request.user.id},
        )

        return Response(
            {"message": "Profile image deleted"},
            status=status.HTTP_200_OK,
        )


class JobSeekerProfileUpdateView(APIView):
    permission_classes = [IsJobseeker]

    def patch(self, request):
        logger.info(
            "Jobseeker profile update requested",
            extra={"user_id": request.user.id},
        )

        try:
            profile = JobSeekerProfile.objects.get(user=request.user)
        except JobSeekerProfile.DoesNotExist:
            logger.warning(
                "Profile not found during update",
                extra={"user_id": request.user.id},
            )
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = JobSeekerProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()
            logger.info(
                "Jobseeker profile updated",
                extra={"user_id": request.user.id},
            )
            return Response(
                {"message": "Profile updated successfully", "profile": serializer.data}
            )

        logger.warning(
            "Jobseeker profile update validation failed",
            extra={"user_id": request.user.id},
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobSeekerSkillView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        logger.info("Jobseeker skills list requested", extra={"user_id": request.user.id})
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerSkillSerializer(
            JobSeekerSkill.objects.filter(profile=profile),
            many=True,
        )
        return Response(serializer.data)

    def post(self, request):
        logger.info("Jobseeker skill create requested", extra={"user_id": request.user.id})
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerSkillSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        logger.info(
            "Jobseeker skill delete requested",
            extra={"skill_id": pk, "user_id": request.user.id},
        )

        try:
            skill = JobSeekerSkill.objects.get(id=pk)
        except JobSeekerSkill.DoesNotExist:
            return Response({"error": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)

        skill.delete()
        return Response({"message": "Skill deleted"}, status=status.HTTP_200_OK)


class JobSeekerExperienceView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        logger.info(
            "Jobseeker experience list requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        exp = JobSeekerExperience.objects.filter(profile=profile)
        serializer = JobSeekerExperienceSerializer(exp, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.info(
            "Jobseeker experience create requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerExperienceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        logger.info(
            "Jobseeker experience update requested",
            extra={"experience_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Experience ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exp = JobSeekerExperience.objects.get(id=pk)
        except JobSeekerExperience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobSeekerExperienceSerializer(exp, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        logger.info(
            "Jobseeker experience delete requested",
            extra={"experience_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Experience ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exp = JobSeekerExperience.objects.get(id=pk)
        except JobSeekerExperience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)

        exp.delete()
        return Response({"message": "Experience deleted"})

class JobSeekerEducationView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        logger.info(
            "Jobseeker education list requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        edu = JobSeekerEducation.objects.filter(profile=profile)
        serializer = JobSeekerEducationSerializer(edu, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.info(
            "Jobseeker education create requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerEducationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        logger.info(
            "Jobseeker education update requested",
            extra={"education_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Education ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            edu = JobSeekerEducation.objects.get(id=pk)
        except JobSeekerEducation.DoesNotExist:
            return Response({"error": "Education not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobSeekerEducationSerializer(edu, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        logger.info(
            "Jobseeker education delete requested",
            extra={"education_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Education ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            edu = JobSeekerEducation.objects.get(id=pk)
        except JobSeekerEducation.DoesNotExist:
            return Response({"error": "Education not found"}, status=status.HTTP_404_NOT_FOUND)

        edu.delete()
        return Response({"message": "Education deleted"})

class JobSeekerLanguageView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        logger.info(
            "Jobseeker language list requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        langs = JobSeekerLanguage.objects.filter(profile=profile)
        serializer = JobSeekerLanguageSerializer(langs, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.info(
            "Jobseeker language create requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerLanguageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        logger.info(
            "Jobseeker language update requested",
            extra={"language_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Language ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lang = JobSeekerLanguage.objects.get(id=pk)
        except JobSeekerLanguage.DoesNotExist:
            return Response({"error": "Language not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobSeekerLanguageSerializer(lang, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        logger.info(
            "Jobseeker language delete requested",
            extra={"language_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Language ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lang = JobSeekerLanguage.objects.get(id=pk)
        except JobSeekerLanguage.DoesNotExist:
            return Response({"error": "Language not found"}, status=status.HTTP_404_NOT_FOUND)

        lang.delete()
        return Response({"message": "Language deleted"})

class JobSeekerAccomplishmentView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        logger.info(
            "Jobseeker accomplishment list requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        acc = JobSeekerAccomplishment.objects.filter(profile=profile)
        serializer = JobSeekerAccomplishmentSerializer(acc, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.info(
            "Jobseeker accomplishment create requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerAccomplishmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        logger.info(
            "Jobseeker accomplishment update requested",
            extra={"accomplishment_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Accomplishment ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            acc = JobSeekerAccomplishment.objects.get(id=pk)
        except JobSeekerAccomplishment.DoesNotExist:
            return Response({"error": "Accomplishment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = JobSeekerAccomplishmentSerializer(acc, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        logger.info(
            "Jobseeker accomplishment delete requested",
            extra={"accomplishment_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Accomplishment ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            acc = JobSeekerAccomplishment.objects.get(id=pk)
        except JobSeekerAccomplishment.DoesNotExist:
            return Response({"error": "Accomplishment not found"}, status=status.HTTP_404_NOT_FOUND)

        acc.delete()
        return Response({"message": "Accomplishment deleted"})

class JobSeekerResumeView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        logger.info(
            "Jobseeker resume list requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        resumes = JobSeekerResume.objects.filter(profile=profile)
        serializer = JobSeekerResumeSerializer(resumes, many=True, context={"profile": profile})
        return Response(serializer.data)

    def post(self, request):
        logger.info(
            "Jobseeker resume create requested",
            extra={"user_id": request.user.id},
        )

        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerResumeSerializer(data=request.data, context={"profile": profile})

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        logger.info(
            "Jobseeker resume update requested",
            extra={"resume_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Resume ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            resume = JobSeekerResume.objects.get(id=pk)
        except JobSeekerResume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerResumeSerializer(resume, data=request.data, partial=True, context={"profile": profile})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        logger.info(
            "Jobseeker resume delete requested",
            extra={"resume_id": pk, "user_id": request.user.id},
        )

        if not pk:
            return Response({"error": "Resume ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            resume = JobSeekerResume.objects.get(id=pk)
        except JobSeekerResume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)

        resume.delete()
        return Response({"message": "Resume deleted"})

