from django.contrib import admin
from jobs.models.job import Job, SavedJob
from jobs.models.skill import JobSkill


admin.site.register(Job)
admin.site.register(JobSkill)
admin.site.register(SavedJob)
