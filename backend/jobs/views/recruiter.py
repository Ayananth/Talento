from rest_framework.generics import CreateAPIView, UpdateAPIView,DestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from jobs.serializers import  RecruiterJobSerializer, JobCreateSerializer, JobPublishSerializer, RecruiterJobListSerializer, JobUpdateSerializer, JobCloseSerializer
from core.permissions import IsRecruiter, IsAdmin
from jobs.models.job import Job
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.response import Response



from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from jobs.filters import RecruiterJobFilter
from jobs.pagination import RecruiterJobPagination
from datetime import timedelta
from django.core.exceptions import PermissionDenied



class RecruiterJobCreateView(CreateAPIView):
    serializer_class = RecruiterJobSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def perform_create(self, serializer):
        recruiter_profile = self.request.user.recruiter_profile

        if not recruiter_profile.can_post_jobs:
            raise PermissionDenied("Job posting disabled by admin")

        serializer.save(
            recruiter=self.request.user,
            status=Job.Status.PUBLISHED,
            published_at=timezone.now(),
            expires_at=timezone.now() + timedelta(days=90),
            is_active=True,
        )

class RecruiterJobUpdateView(UpdateAPIView):
    serializer_class = RecruiterJobSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    queryset = Job.objects.all()

    def get_queryset(self):
        return self.queryset.filter(recruiter=self.request.user)


    def delete(self, request, pk):
        job = get_object_or_404(Job, pk=pk, recruiter=request.user)
        if not job.is_active or job.status == Job.Status.CLOSED:
            return Response(
                {"detail": "Job is already closed."},
                status=400
            )
        job.is_active = False
        job.status = Job.Status.CLOSED
        job.save()

        return Response(status=204)
# class JobPublishView(UpdateAPIView):
#     serializer_class = JobPublishSerializer
#     permission_classes = [IsAuthenticated, IsRecruiter]
#     queryset = Job.objects.all()

#     def get_queryset(self):
#         return Job.objects.filter(recruiter=self.request.user)

#     def perform_update(self, serializer):
#         serializer.instance.status = Job.Status.PUBLISHED
#         serializer.instance.published_at = timezone.now()
#         serializer.instance.expires_at = timezone.now() + timedelta(days=90)
#         serializer.instance.save()


class RecruiterJobListView(ListAPIView):
    serializer_class = RecruiterJobListSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    pagination_class = RecruiterJobPagination

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = RecruiterJobFilter
    ordering_fields = ["created_at", "published_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Job.objects.filter(
            recruiter=self.request.user
        )
    



# class JobUpdateView(UpdateAPIView):
#     serializer_class = JobUpdateSerializer
#     permission_classes = [IsAuthenticated, IsRecruiter]
#     queryset = Job.objects.all()

#     def get_queryset(self):
#         return Job.objects.filter(recruiter=self.request.user)

#     def perform_update(self, serializer):
#         job = self.get_object()

#         if job.status != Job.Status.DRAFT:
#             raise ValidationError(
#                 "Only draft jobs can be edited."
#             )

#         serializer.save()




# class JobCloseView(UpdateAPIView):
#     serializer_class = JobCloseSerializer
#     permission_classes = [IsAuthenticated, IsRecruiter]
#     queryset = Job.objects.all()

#     def get_queryset(self):
#         return Job.objects.filter(recruiter=self.request.user)

#     def perform_update(self, serializer):
#         job = self.get_object()
#         job.status = Job.Status.CLOSED
#         job.save()

