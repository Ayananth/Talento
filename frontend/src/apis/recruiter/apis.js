
import api from '../api'

const createRecruiter = async (payload)=> {

    const response = await api.post(
      "/v1/recruiter/profile/draft/create/",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response


}

export {
    createRecruiter
}



export const getRecruiterJobs = async (page = 1, ordering = "") => {
  const params = {
    page,
    ...(ordering && { ordering }),
  };

  const res = await api.get("/v1/jobs/recruiter/jobs/", {
    params,
  });

  return res.data;
};


export const createJob = async (payload) => {
  const res = await api.post("/v1/jobs/jobs/", payload);
  return res.data;
};

export const deleteJob = async (jobId) => {
  await api.delete(`/v1/jobs/recruiter/jobs/${jobId}/`);
};
