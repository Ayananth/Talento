import api from '@/apis/api'

export const getPendingList = async (page = 1, ordering = "") => {
  const res = await api.get(`/v1/recruiter/recruiters/pending/`, {
    params: { page, ordering },
  });
  return res.data;
};    
