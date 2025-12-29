import cloudinary.uploader as uploader

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from core.permissions import IsJobseeker
from profiles.models import JobSeekerResume
from .serializers import ApplyJobSerializer, JobApplicationSerializer


class ApplyJobView(APIView):
    permission_classes = [IsJobseeker]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        resume_file = request.FILES.get("resume")
        resume_id = request.data.get("resume_id")

        uploaded_asset = None

        if resume_id:
            resume = JobSeekerResume.objects.get(
                id=resume_id,
                profile=request.user.jobseeker_profile
            )

            uploaded_asset = uploader.upload(
                resume.file.url,                     # delivery URL
                resource_type="image",
                folder="talento-dev/resumes/applications"
            )

        elif resume_file:
            uploaded_asset = uploader.upload(
                resume_file,
                resource_type="image",
                folder="talento-dev/resumes/applications"
            )

        else:
            return Response(
                {"resume": ["Resume is required."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ApplyJobSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        application = serializer.save(
            applicant=request.user.jobseeker_profile,
            resume=uploaded_asset["public_id"] 
        )

        return Response(
            JobApplicationSerializer(application).data,
            status=status.HTTP_201_CREATED
        )
