from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import SubscriptionPlan, UserSubscription
from .serializers import CreateOrderSerializer, VerifyPaymentSerializer
from .razorpay_client import client

from razorpay.errors import SignatureVerificationError
from django.utils import timezone
from datetime import timedelta


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

