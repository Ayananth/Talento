from django.contrib import admin
from jobs.models.job import Job
from jobs.models.skill import JobSkill
from jobs.models.application import JobApplication


admin.site.register(Job)
admin.site.register(JobSkill)
admin.site.register(JobApplication)
