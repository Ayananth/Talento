import api from "@/apis/api";

export const getAdminJobs = async ({
  page = 1,
  ordering = "",
  company = "",
  status = "",
}) => {
  const params = {
    page,
    ...(ordering && { ordering }),
    ...(company && { company }),
    ...(status && { status }),
  };

  const res = await api.get("/v1/admin/jobs", { params });
  return res.data;
};



export const getAdminJobDetails = async (id) => {
  const res = await api.get(`/v1/admin/jobs/${id}`);
  return res.data;
};

export const unpublishAdminJob = async (id) => {
  const res = await api.patch(`/v1/admin/jobs/${id}/unpublish`);
  return res.data;
};


