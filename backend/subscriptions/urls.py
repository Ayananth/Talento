from django.urls import path
from .views import CreateSubscriptionOrderAPIView

app_name = "subscriptions" 

urlpatterns = [
    path(
        "create-order/",
        CreateSubscriptionOrderAPIView.as_view(),
        name="create-subscription-order"
    ),
]
