import api from "@/apis/api"

export const createOrder = async (planId) => {
  const res = await api.post(
    "v1/subscriptions/create-order/",
    { plan_id: planId }
  );
  return res.data;
};
