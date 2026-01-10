from django.db import models
from django.conf import settings
from django.utils import timezone



class SubscriptionPlan(models.Model):
    PLAN_TYPE_CHOICES = (
        ("jobseeker", "Job Seeker"),
        ("recruiter", "Recruiter"),
    )

    name = models.CharField(max_length=100)
    plan_type = models.CharField(
        max_length=20,
        choices=PLAN_TYPE_CHOICES
    )

    duration_months = models.PositiveIntegerField()
    price = models.PositiveIntegerField(
        help_text="Price in INR"
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.duration_months} months)"
    
    
    
class UserSubscription(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("active", "Active"),
        ("expired", "Expired"),
        ("failed", "Failed"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscriptions"
    )

    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT
    )

    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    # Razorpay fields
    razorpay_order_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    razorpay_payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def is_active(self):
        return (
            self.status == "active"
            and self.end_date
            and self.end_date > timezone.now()
        )

    def __str__(self):
        return f"{self.user} - {self.plan.name} ({self.status})"

