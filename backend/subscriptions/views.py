import hashlib
import hmac
import json
import logging
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from razorpay.errors import SignatureVerificationError

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SubscriptionPlan, UserSubscription
from .razorpay_client import client
from .serializers import (
    CreateOrderSerializer,
    SubscriptionPlanSerializer,
    VerifyPaymentSerializer,
)
from .services import get_active_subscription

logger = logging.getLogger(__name__)


class CreateSubscriptionOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logger.info(
            "Create subscription order requested",
            extra={"user_id": request.user.id},
        )

        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        plan_id = serializer.validated_data["plan_id"]

        existing_subscription = UserSubscription.objects.filter(
            user=request.user,
            status="active",
            end_date__gt=timezone.now(),
        ).exists()

        if existing_subscription:
            logger.warning(
                "User attempted to create order with active subscription",
                extra={"user_id": request.user.id},
            )
            raise ValidationError("You already have an active subscription.")

        try:
            plan = SubscriptionPlan.objects.get(
                id=plan_id,
                is_active=True,
            )
        except SubscriptionPlan.DoesNotExist:
            logger.warning(
                "Invalid subscription plan selected",
                extra={"plan_id": plan_id},
            )
            return Response(
                {"detail": "Invalid subscription plan"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        amount_paise = plan.price * 100

        razorpay_order = client.order.create(
            {
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": 1,
            }
        )

        subscription = UserSubscription.objects.create(
            user=request.user,
            plan=plan,
            status="pending",
            razorpay_order_id=razorpay_order["id"],
        )

        logger.info(
            "Subscription order created",
            extra={
                "user_id": request.user.id,
                "subscription_id": subscription.id,
                "razorpay_order_id": razorpay_order["id"],
            },
        )

        return Response(
            {
                "order_id": razorpay_order["id"],
                "amount": plan.price,
                "currency": "INR",
                "subscription_id": subscription.id,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifySubscriptionPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logger.info(
            "Verify subscription payment requested",
            extra={"user_id": request.user.id},
        )

        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            subscription = UserSubscription.objects.get(
                razorpay_order_id=data["razorpay_order_id"],
                user=request.user,
                status="pending",
            )
        except UserSubscription.DoesNotExist:
            logger.warning(
                "Invalid or already processed subscription order",
                extra={
                    "user_id": request.user.id,
                    "razorpay_order_id": data["razorpay_order_id"],
                },
            )
            return Response(
                {"detail": "Invalid or already processed order"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": data["razorpay_order_id"],
                    "razorpay_payment_id": data["razorpay_payment_id"],
                    "razorpay_signature": data["razorpay_signature"],
                }
            )
        except SignatureVerificationError:
            subscription.status = "failed"
            subscription.save()

            logger.warning(
                "Subscription payment verification failed",
                extra={
                    "subscription_id": subscription.id,
                    "razorpay_order_id": data["razorpay_order_id"],
                },
            )

            return Response(
                {"detail": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        start_date = timezone.now()
        end_date = start_date + timedelta(
            days=30 * subscription.plan.duration_months
        )

        subscription.razorpay_payment_id = data["razorpay_payment_id"]
        subscription.start_date = start_date
        subscription.end_date = end_date
        subscription.status = "active"
        subscription.save()

        logger.info(
            "Subscription activated",
            extra={
                "subscription_id": subscription.id,
                "user_id": request.user.id,
            },
        )

        return Response(
            {
                "detail": "Subscription activated",
                "start_date": start_date,
                "end_date": end_date,
            },
            status=status.HTTP_200_OK,
        )


class SubscriptionStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logger.info(
            "Subscription status requested",
            extra={"user_id": request.user.id},
        )

        sub = get_active_subscription(request.user)

        return Response(
            {
                "is_active": bool(sub),
                "plan_name": sub.plan.name if sub else None,
                "end_date": sub.end_date if sub else None,
            }
        )


class GetSubscriptionPlans(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user

        logger.info(
            "Subscription plans requested",
            extra={
                "user_authenticated": user.is_authenticated,
                "role": getattr(user, "role", None),
            },
        )

        if not user.is_authenticated:
            plans = SubscriptionPlan.objects.filter(
                plan_type="jobseeker",
                is_active=True,
            ).order_by("duration_months")

        elif user.is_staff or user.role == "admin":
            plans = SubscriptionPlan.objects.all().order_by("duration_months")

        elif user.role == "recruiter":
            plans = SubscriptionPlan.objects.filter(
                plan_type="recruiter",
                is_active=True,
            ).order_by("duration_months")

        else:
            plans = SubscriptionPlan.objects.filter(
                plan_type="jobseeker",
                is_active=True,
            ).order_by("duration_months")

        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response(serializer.data)


def verify_webhook_signature(body, signature):
    secret = settings.RAZORPAY_WEBHOOK_SECRET.encode()

    expected_signature = hmac.new(
        secret,
        body,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected_signature, signature)


class RazorpayWebhookAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        signature = request.headers.get("X-Razorpay-Signature")
        body = request.body

        logger.info("Razorpay webhook received")

        if not verify_webhook_signature(body, signature):
            logger.warning("Invalid Razorpay webhook signature")
            return Response(
                {"detail": "Invalid signature"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = json.loads(body)
        event = payload.get("event")

        if event == "payment.captured":
            payment = payload["payload"]["payment"]["entity"]

            razorpay_order_id = payment["order_id"]
            razorpay_payment_id = payment["id"]

            try:
                subscription = UserSubscription.objects.get(
                    razorpay_order_id=razorpay_order_id,
                    status="pending",
                )
            except UserSubscription.DoesNotExist:
                logger.info(
                    "Webhook received for already processed or invalid order",
                    extra={"razorpay_order_id": razorpay_order_id},
                )
                return Response(status=status.HTTP_200_OK)

            start_date = timezone.now()
            end_date = start_date + timedelta(
                days=30 * subscription.plan.duration_months
            )

            subscription.razorpay_payment_id = razorpay_payment_id
            subscription.start_date = start_date
            subscription.end_date = end_date
            subscription.status = "active"
            subscription.save()

            logger.info(
                "Subscription activated via webhook",
                extra={
                    "subscription_id": subscription.id,
                    "razorpay_order_id": razorpay_order_id,
                },
            )

        return Response(status=status.HTTP_200_OK)
