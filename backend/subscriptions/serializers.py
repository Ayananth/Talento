from rest_framework import serializers

class CreateOrderSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField()
