export const openRazorpay = ({ order, onSuccess }) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount * 100,
    currency: "INR",
    name: "Your Job Portal",
    description: "Premium Subscription",
    order_id: order.order_id,

    handler: function (response) {
      onSuccess(response);
    },

    theme: {
      color: "#2563eb",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
