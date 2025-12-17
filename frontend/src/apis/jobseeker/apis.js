import api from "../api";

export const getJobs = async ({
  page = 1,
  ordering = "",
} = {}) => {
  const res = await api.get("/v1/jobs/jobs/public/", {
    params: {
      page,
      ...(ordering && { ordering }),
    },
  });

  return res.data;
};
