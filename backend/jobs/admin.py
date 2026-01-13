from django.contrib import admin
from jobs.models.job import Job
from jobs.models.skill import JobSkill


admin.site.register(Job)
admin.site.register(JobSkill)
