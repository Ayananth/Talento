from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import SubscriptionPlan, UserSubscription
from .serializers import CreateOrderSerializer, VerifyPaymentSerializer, SubscriptionPlanSerializer
from .razorpay_client import client
from .services import get_active_subscription


from razorpay.errors import SignatureVerificationError
from django.utils import timezone
from datetime import timedelta

import json
import hmac
import hashlib

from django.conf import settings
from rest_framework.permissions import AllowAny



class CreateSubscriptionOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        plan_id = serializer.validated_data["plan_id"]

        try:
            plan = SubscriptionPlan.objects.get(
                id=plan_id,
                is_active=True
            )
        except SubscriptionPlan.DoesNotExist:
            return Response(
                {"detail": "Invalid subscription plan"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Amount in paise
        amount_paise = plan.price * 100

        # Create Razorpay order
        razorpay_order = client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "payment_capture": 1
        })

        # Create pending subscription
        subscription = UserSubscription.objects.create(
            user=request.user,
            plan=plan,
            status="pending",
            razorpay_order_id=razorpay_order["id"]
        )

        return Response(
            {
                "order_id": razorpay_order["id"],
                "amount": plan.price,
                "currency": "INR",
                "subscription_id": subscription.id
            },
            status=status.HTTP_201_CREATED
        )
    

class VerifySubscriptionPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        try:
            subscription = UserSubscription.objects.get(
                razorpay_order_id=data["razorpay_order_id"],
                user=request.user,
                status="pending"
            )
        except UserSubscription.DoesNotExist:
            return Response(
                {"detail": "Invalid or already processed order"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": data["razorpay_order_id"],
                "razorpay_payment_id": data["razorpay_payment_id"],
                "razorpay_signature": data["razorpay_signature"],
            })
        except SignatureVerificationError:
            subscription.status = "failed"
            subscription.save()
            return Response(
                {"detail": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
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

        return Response(
            {
                "detail": "Subscription activated",
                "start_date": start_date,
                "end_date": end_date
            },
            status=status.HTTP_200_OK
        )




class SubscriptionStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub = get_active_subscription(request.user)

        return Response({
            "is_active": bool(sub),
            "plan_name": sub.plan.name if sub else None,
            "end_date": sub.end_date if sub else None
        })
    

class GetSubscriptionPlans(APIView):
    def get(self, request):
        plans = SubscriptionPlan.objects.filter(
            is_active=True,
            plan_type="jobseeker"
        ).order_by("duration_months")

        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response(serializer.data)
    

def verify_webhook_signature(body, signature):
    secret = settings.RAZORPAY_WEBHOOK_SECRET.encode()
    expected_signature = hmac.new(
        secret,
        body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected_signature, signature)


class RazorpayWebhookAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        signature = request.headers.get("X-Razorpay-Signature")
        body = request.body

        if not verify_webhook_signature(body, signature):
            return Response(
                {"detail": "Invalid signature"},
                status=400
            )

        payload = json.loads(body)

        event = payload.get("event")

        # Payment success
        if event == "payment.captured":
            payment = payload["payload"]["payment"]["entity"]

            razorpay_order_id = payment["order_id"]
            razorpay_payment_id = payment["id"]

            try:
                subscription = UserSubscription.objects.get(
                    razorpay_order_id=razorpay_order_id,
                    status="pending"
                )
            except UserSubscription.DoesNotExist:
                # Already processed or invalid
                return Response(status=200)

            from django.utils import timezone
            from datetime import timedelta

            start_date = timezone.now()
            end_date = start_date + timedelta(
                days=30 * subscription.plan.duration_months
            )

            subscription.razorpay_payment_id = razorpay_payment_id
            subscription.start_date = start_date
            subscription.end_date = end_date
            subscription.status = "active"
            subscription.save()

        return Response(status=200)
