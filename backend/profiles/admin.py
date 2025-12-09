from django.contrib import admin
from . import models

admin.site.register(models.JobSeekerProfile)
admin.site.register(models.JobSeekerSkill)
admin.site.register(models.JobSeekerAccomplishment)
admin.site.register(models.JobSeekerEducation)
admin.site.register(models.JobSeekerExperience)
admin.site.register(models.JobSeekerResume)
admin.site.register(models.JobSeekerLanguage)

