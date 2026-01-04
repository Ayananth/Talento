import api from "../api";


export const createRecruiter = async (payload) => {
  const response = await api.post(
    "/v1/recruiter/profile/draft/create/",
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};


export const getRecruiterJobs = async ({
  page = 1,
  ordering = "",
  search = "",
  status = "",
} = {}) => {
  const res = await api.get("/v1/jobs/recruiter/jobs/", {
    params: {
      page,
      ...(ordering && { ordering }),
      ...(search && { search }),
      ...(status && { status }),
    },
  });

  return res.data;
};


export const createJob = async (payload) => {
  const res = await api.post("/v1/jobs/jobs/", payload);
  return res.data;
};

export const deleteJob = async (jobId) => {
  await api.delete(`/v1/jobs/recruiter/jobs/${jobId}/delete/`);
};

export const getRecruiterJobDetail = async (id) => {
  const res = await api.get(`/v1/jobs/recruiter/jobs/${id}/`);
  return res.data;
};

export const updateJob = async (id, payload) => {
  const res = await api.put(
    `/v1/jobs/recruiter/jobs/${id}/update/`,
    payload
  );
  return res.data;
};



export const getRecruiterProfile = async () => {
  const res = await api.get("/v1/recruiter/profile/");
  return res.data;
};

export const updateRecruiterProfileDraft = async (payload) => {
  const res = await api.patch(
    "/v1/recruiter/profile/draft/update/",
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};



export const createRecruiterProfileDraft = async (payload) => {
  const res = await api.post(
    "/v1/recruiter/profile/draft/create/",
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const getRecruiterApplications = async ({
  page = 1,
  ordering = "",
  search = "",
  status = "",
} = {}) => {
  const res = await api.get("/v1/applications/recruiter/applications", {
    params: {
      page,
      ...(ordering && { ordering }),
      ...(search && { search }),
      ...(status && { status }),
    },
  });

  return res.data;
}

