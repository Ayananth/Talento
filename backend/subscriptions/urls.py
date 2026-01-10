from django.urls import path
from .views import CreateSubscriptionOrderAPIView, VerifySubscriptionPaymentAPIView, SubscriptionStatusAPIView, GetSubscriptionPlans

app_name = "subscriptions" 

urlpatterns = [
    path(
        "create-order/",
        CreateSubscriptionOrderAPIView.as_view(),
        name="create-subscription-order"
    ),

    path(
        "verify-payment/",
        VerifySubscriptionPaymentAPIView.as_view(),
        name="verify-subscription-payment"
    ),

    path("status/", SubscriptionStatusAPIView.as_view()),

    path("plans/", GetSubscriptionPlans.as_view()),


]
