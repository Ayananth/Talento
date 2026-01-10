from django.urls import path
from .views import CreateSubscriptionOrderAPIView, VerifySubscriptionPaymentAPIView

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
]
