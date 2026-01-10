import api from "@/apis/api"

export const getPlans = async () => {
  const res = await axios.get("/api/subscriptions/plans/")
  return res.data;
};
