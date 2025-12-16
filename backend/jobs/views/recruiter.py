from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from jobs.serializers import JobCreateSerializer, JobPublishSerializer
from core.permissions import IsRecruiter
from jobs.models.job import Job
from django.utils import timezone


class JobCreateView(CreateAPIView):
    serializer_class = JobCreateSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

class JobPublishView(UpdateAPIView):
    serializer_class = JobPublishSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    queryset = Job.objects.all()

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user)

    def perform_update(self, serializer):
        serializer.instance.status = Job.Status.PUBLISHED
        serializer.instance.published_at = timezone.now()
        serializer.instance.save()

