import api from "../../../apis/api"

const handleCheckout = async (selectedPlan, order) => {
  if (!selectedPlan || loading) return;

  try {
    setLoading(true);

    // 1️⃣ Create order
    const res = await api.post(
      "/api/subscriptions/create-order/",
      { plan_id: selectedPlan.id }
    );

    const order = res.data;

    // 2️⃣ Open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount * 100,
      currency: "INR",
      name: "Talento Pro",
      description: "Premium Subscription",
      order_id: order.order_id,

      handler: async function (response) {
        // 3️⃣ Verify payment
        await api.post(
          "/api/subscriptions/verify-payment/",
          response
        );

        alert("🎉 Subscription activated");
        window.location.reload();
      },

      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
