import api from "@/apis/api"

export const createOrder = async (planId) => {
  const res = await api.post(
    "v1/subscriptions/create-order/",
    { plan_id: planId }
  );
  return res.data;
};




/**
 * Get all active subscription plans
 */
export const getSubscriptionPlans = async () => {
  const res = await api.get("v1/subscriptions/plans/");
  return res.data;
};

/**
 * Create Razorpay order for a plan
 */
export const createSubscriptionOrder = async (planId) => {
  const res = await api.post("v1/subscriptions/create-order/", {
    plan_id: planId,
  });
  return res.data;
};

/**
 * Verify Razorpay payment
 */
export const verifySubscriptionPayment = async (payload) => {
  return api.post("v1/subscriptions/verify-payment/", payload);
};



export const getSubscriptionStatus = async () => {
  const res = await api.get("v1/subscriptions/status/");
  return res.data;
};