import api from "../../../../shared/api/api"

export const getPendingList = async (page = 1) => {
  const res = await api.get(`/v1/recruiter/recruiters?page=${page}`);
  return res.data;
};
