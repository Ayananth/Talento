import api from "../api";

export const getTransactions = async ({
  page = 1,
  ordering = "-created_at",
  status = "",
  plan_type = "",
  user_id = "",
  from_date = "", 
  to_date = "",     
} = {}) => {
  const params = {
    page,
    ...(ordering && { ordering }),
    ...(status && { status }),
    ...(plan_type && { plan_type }),
    ...(user_id && { user_id }),
    ...(from_date && { from_date }),
    ...(to_date && { to_date }),
  };

  const res = await api.get("/v1/admin/transactions/", { params });
  return res.data;
};
