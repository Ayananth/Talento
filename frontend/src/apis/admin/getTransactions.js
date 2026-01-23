import api from "../api";



export const getTransactions = async ({
  page = 1,
  ordering = "-created_at",
  status = "",
  plan_type = "",
  user_id = "",
  start_date = "", 
  end_date = "",
} = {}) => {
  const params = {
    page,
    ...(ordering && { ordering }),
    ...(status && { status }),
    ...(plan_type && { plan_type }),
    ...(user_id && { user_id }),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
  };

  const res = await api.get("/v1/admin/transactions/", { params });
  return res.data;
};
