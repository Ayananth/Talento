from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import SubscriptionPlan, UserSubscription
from .serializers import CreateOrderSerializer
from .razorpay_client import client


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
