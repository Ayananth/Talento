from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from jobs.models.job import Job
from jobs.models.skill import JobSkill
from recruiter.models import RecruiterProfile
import random
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = "Create 100 dummy jobs for recruiter users"

    def handle(self, *args, **kwargs):
        recruiters = User.objects.filter(role="recruiter")

        if not recruiters.exists():
            self.stdout.write(self.style.ERROR("No recruiter users found"))
            return

        # Create skills if they don't exist
        skill_names = [
            "python", "django", "postgresql",
            "docker", "aws", "redis",
            "react", "javascript"
        ]

        skills = []
        for name in skill_names:
            skill, _ = JobSkill.objects.get_or_create(name=name)
            skills.append(skill)

        job_titles = [
            "Backend Python Developer",
            "Django Developer",
            "Software Engineer",
            "API Developer",
            "Full Stack Developer",
            "Senior Backend Engineer",
        ]

        for i in range(100):
            recruiter = random.choice(recruiters)

            job = Job.objects.create(
                recruiter=recruiter,
                title=random.choice(job_titles),
                description="Looking for a Django backend developer with REST API experience.",
                job_type=Job.JobType.FULL_TIME,
                work_mode=Job.WorkMode.REMOTE,
                experience_level=random.choice([
                    Job.ExperienceLevel.FRESHER,
                    Job.ExperienceLevel.MID,
                    Job.ExperienceLevel.SENIOR,
                ]),
                location_city="Kochi",
                location_state="Kerala",
                location_country="India",
                salary_min=600000,
                salary_max=1200000,
                salary_currency="INR",
                salary_hidden=False,
                openings=random.randint(1, 5),
                status=Job.Status.PUBLISHED,
                is_active=True,
                published_at=timezone.now(),
                expires_at=timezone.now() + timedelta(days=60),
            )

            # Attach random skills
            job.skills.set(random.sample(skills, k=random.randint(2, 4)))

            self.stdout.write(
                self.style.SUCCESS(f"Created job {i + 1}/100 → {job.title}")
            )

        self.stdout.write(self.style.SUCCESS("✅ Successfully created 100 jobs"))
