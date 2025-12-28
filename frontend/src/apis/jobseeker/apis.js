import api from "../api";

export const getJobs = async ({
  page = 1,
  ordering = "",
  search = "",
  location = "",
} = {}) => {
  const res = await api.get("/v1/jobs/jobs/public/", {
    params: {
      page,
      ...(ordering && { ordering }),
      ...(search && { search }),
      ...(location && { location_city: location }),
    },
  });

  return res.data;
};




export const getJobDetail = async (id) => {
  const res = await api.get(`/v1/jobs/jobs/public/${id}/`);
  return res.data;
};





export const getMyResumes = async () => {
  const res = await api.get("/v1/profile/me/resumes/");
  return res.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", file.name);

  const res = await api.post("v1/profile/me/resumes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
