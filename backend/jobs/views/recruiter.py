from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from jobs.serializers import JobCreateSerializer, JobPublishSerializer, RecruiterJobListSerializer, JobUpdateSerializer, JobCloseSerializer
from core.permissions import IsRecruiter
from jobs.models.job import Job
from django.utils import timezone
from rest_framework.exceptions import ValidationError


from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from jobs.filters import RecruiterJobFilter
from jobs.pagination import RecruiterJobPagination



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
    



class JobUpdateView(UpdateAPIView):
    serializer_class = JobUpdateSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    queryset = Job.objects.all()

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user)

    def perform_update(self, serializer):
        job = self.get_object()

        if job.status != Job.Status.DRAFT:
            raise ValidationError(
                "Only draft jobs can be edited."
            )

        serializer.save()




class JobCloseView(UpdateAPIView):
    serializer_class = JobCloseSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    queryset = Job.objects.all()

    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user)

    def perform_update(self, serializer):
        job = self.get_object()
        job.status = Job.Status.CLOSED
        job.save()




