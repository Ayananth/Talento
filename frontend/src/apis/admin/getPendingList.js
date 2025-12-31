import api from '@/apis/api'

// export const getPendingList = async (page = 1, ordering = "") => {
//   const res = await api.get(`/v1/recruiter/recruiters/pending/`, {
//     params: { page, ordering },
//   });
//   return res.data;
// };    

export const getPendingList = async ({
  page = 1,
  ordering = "",
  search = "",
  status = "",
  request_type = "",
}) => {
  const params = {
    page,
    ...(ordering && { ordering }),
    ...(search && { search }),
    ...(status && { status }),
    ...(request_type && { request_type }),
  };

  const res = await api.get("/v1/recruiter/recruiters/pending/", { params });
  return res.data;
};
