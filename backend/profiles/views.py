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
from .serializers import (FullJobSeekerProfileSerializer,  
                          JobSeekerProfileSerializer, 
                          JobSeekerSkillSerializer,
                          JobSeekerExperienceSerializer,
                          JobSeekerEducationSerializer ,
                          JobSeekerLanguageSerializer ,
                          JobSeekerAccomplishmentSerializer ,
                          JobSeekerResumeSerializer                       
                          )


class JobSeekerProfileView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        user = request.user


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

        serializer = JobSeekerProfileSerializer(
            profile, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully", "profile": serializer.data})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class JobSeekerSkillView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        skills = JobSeekerSkill.objects.filter(profile=profile)
        serializer = JobSeekerSkillSerializer(skills, many=True)
        return Response(serializer.data)

    def post(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerSkillSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

    def delete(self, request, pk):
        try:
            skill = JobSeekerSkill.objects.get(id=pk)
        except JobSeekerSkill.DoesNotExist:
            return Response({"error": "Skill not found"}, status=404)

        skill.delete()
        return Response({"message": "Skill deleted"}, status=200)
    


class JobSeekerExperienceView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        exp = JobSeekerExperience.objects.filter(profile=profile)
        serializer = JobSeekerExperienceSerializer(exp, many=True)
        return Response(serializer.data)

    def post(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerExperienceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def patch(self, request, pk=None):
        if not pk:
            return Response({"error": "Experience ID required"}, status=400)

        try:
            exp = JobSeekerExperience.objects.get(id=pk)
        except JobSeekerExperience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=404)

        serializer = JobSeekerExperienceSerializer(exp, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Experience ID required"}, status=400)

        try:
            exp = JobSeekerExperience.objects.get(id=pk)
        except JobSeekerExperience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=404)

        exp.delete()
        return Response({"message": "Experience deleted"})
    

class JobSeekerEducationView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        edu = JobSeekerEducation.objects.filter(profile=profile)
        serializer = JobSeekerEducationSerializer(edu, many=True)
        return Response(serializer.data)

    def post(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerEducationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def patch(self, request, pk=None):
        if not pk:
            return Response({"error": "Education ID required"}, status=400)

        try:
            edu = JobSeekerEducation.objects.get(id=pk)
        except JobSeekerEducation.DoesNotExist:
            return Response({"error": "Education not found"}, status=404)

        serializer = JobSeekerEducationSerializer(edu, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Education ID required"}, status=400)

        try:
            edu = JobSeekerEducation.objects.get(id=pk)
        except JobSeekerEducation.DoesNotExist:
            return Response({"error": "Education not found"}, status=404)

        edu.delete()
        return Response({"message": "Education deleted"})
    

class JobSeekerLanguageView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        langs = JobSeekerLanguage.objects.filter(profile=profile)
        serializer = JobSeekerLanguageSerializer(langs, many=True)
        return Response(serializer.data)

    def post(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerLanguageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def patch(self, request, pk=None):
        if not pk:
            return Response({"error": "Language ID required"}, status=400)

        try:
            lang = JobSeekerLanguage.objects.get(id=pk)
        except JobSeekerLanguage.DoesNotExist:
            return Response({"error": "Language not found"}, status=404)

        serializer = JobSeekerLanguageSerializer(lang, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Language ID required"}, status=400)

        try:
            lang = JobSeekerLanguage.objects.get(id=pk)
        except JobSeekerLanguage.DoesNotExist:
            return Response({"error": "Language not found"}, status=404)

        lang.delete()
        return Response({"message": "Language deleted"})



    

class JobSeekerAccomplishmentView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        acc = JobSeekerAccomplishment.objects.filter(profile=profile)
        serializer = JobSeekerAccomplishmentSerializer(acc, many=True)
        return Response(serializer.data)

    def post(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerAccomplishmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def patch(self, request, pk=None):
        if not pk:
            return Response({"error": "Accomplishment ID required"}, status=400)

        try:
            acc = JobSeekerAccomplishment.objects.get(id=pk)
        except JobSeekerAccomplishment.DoesNotExist:
            return Response({"error": "Accomplishment not found"}, status=404)

        serializer = JobSeekerAccomplishmentSerializer(acc, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Accomplishment ID required"}, status=400)

        try:
            acc = JobSeekerAccomplishment.objects.get(id=pk)
        except JobSeekerAccomplishment.DoesNotExist:
            return Response({"error": "Accomplishment not found"}, status=404)

        acc.delete()
        return Response({"message": "Accomplishment deleted"})



class JobSeekerResumeView(APIView):
    permission_classes = [IsJobseeker]

    def get(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        resumes = JobSeekerResume.objects.filter(profile=profile)
        serializer = JobSeekerResumeSerializer(resumes, many=True)
        return Response(serializer.data)

    def post(self, request):
        profile = JobSeekerProfile.objects.get(user=request.user)
        serializer = JobSeekerResumeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(profile=profile)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def patch(self, request, pk=None):
        if not pk:
            return Response({"error": "Resume ID required"}, status=400)

        try:
            resume = JobSeekerResume.objects.get(id=pk)
        except JobSeekerResume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=404)

        serializer = JobSeekerResumeSerializer(resume, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Resume ID required"}, status=400)

        try:
            resume = JobSeekerResume.objects.get(id=pk)
        except JobSeekerResume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=404)

        resume.delete()
        return Response({"message": "Resume deleted"})
