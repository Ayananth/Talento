from django.db import models

class TypeChoices(models.TextChoices):
    # jobseeker notifications
    STATUS_CHANGE = "StatusChange", "Status Change"
    JOB_MATCH_FOUND = "JobMatchFound", "Job Match Found"

    # Rrecruiter notifications
    JOB_APPLICATION = "JobApplication", "Job Application"
    ADMIN_ACTIONS = "AdminActions", "Admin Actions"
    JOB_EXPIRED = "JobExpired", "Job Expired"

    # common notifications for jobseeker and recruiter
    SUBSCRIPTION_END = "SubscriptionEnd", "Subscription End"

    
    # Admin notifications
    RECRUITER_ACTIONS = "RecruiterActions", "Recruiter Actions"
    NEW_SUBSCRIBER = "NewSubscriber", "New Subscriber"
    USER_REGISTRATION = "UserRegistration", "User Registration"
    JOB_MATCH_SENT = "JobMatchSent", "Job Match Sent"
    JOB_POSTED = "JobPosted", "Job Posted"
    
    OTHER = "Other", "Other"


class RoleChoices(models.TextChoices):
    JOBSEEKER = "jobseeker", "Job Seeker"
    RECRUITER = "recruiter", "Recruiter"
    ADMIN = "admin", "Admin"