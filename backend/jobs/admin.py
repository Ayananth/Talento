from django.contrib import admin
from .model import application, skill, job

admin.site.register(application.JobApplication)
admin.site.register(skill.JobSkill)
admin.site.register(job.Job)

