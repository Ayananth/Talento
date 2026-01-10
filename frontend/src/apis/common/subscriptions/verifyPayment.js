export const verifyPayment = async (payload) => {
  return axios.post(
    "/api/subscriptions/verify-payment/",
    payload
  );
};
