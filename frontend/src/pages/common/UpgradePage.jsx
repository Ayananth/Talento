import PremiumPlans from "./PremiumPlans";
import { createOrder } from "@/api/subscriptions";
import { verifyPayment } from "@/api/verifyPayment";
import { openRazorpay } from "./useRazorpay";

export default function UpgradePage() {
  const handleSelectPlan = async (plan) => {
    const order = await createOrder(plan.id);

    openRazorpay({
      order,
      onSuccess: async (paymentData) => {
        await verifyPayment(paymentData);
        alert("Subscription activated 🎉");
      },
    });
  };

  return <PremiumPlans onSelect={handleSelectPlan} />;
}
