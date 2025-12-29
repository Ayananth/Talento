from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from jobs.models.job import Job
from core.permissions import IsJobseeker
# from jobs.serializers import JobApplySerializer


# class JobApplyView(CreateAPIView):
#     serializer_class = JobApplySerializer
#     permission_classes = [IsAuthenticated, IsJobseeker]

#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context["job"] = get_object_or_404(
#             Job,
#             id=self.kwargs["job_id"],
#             is_active=True
#         )
#         return context
