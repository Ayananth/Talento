import api from "@/apis/api";

export const getAdminJobs = async (page = 1, ordering = "") => {
  const params = {
    page,
    ...(ordering && { ordering }),
  };

  const res = await api.get("/v1/admin/jobs", { params });
  return res.data;
};



export const getAdminJobDetails = async (id) => {
  const res = await api.get(`/v1/admin/jobs/${id}`);
  return res.data;
};



