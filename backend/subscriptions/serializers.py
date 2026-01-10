from rest_framework import serializers

class CreateOrderSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField()

class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()

class SubscriptionStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()
    plan_name = serializers.CharField(allow_null=True)
    end_date = serializers.DateTimeField(allow_null=True)

