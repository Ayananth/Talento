import api from "@/apis/api";

export const getAdminUsers = ({
  page = 1,
  ordering = "",
  search = "",
  role = "",
  status = "",
  verified = "",
}) => {
  return api.get("/v1/auth/admin/users/", {
    params: {
      page,
      ordering,
      ...(search && { search }),
      ...(role && { role }),
      ...(status !== "" && { is_blocked: status }),
      ...(verified !== "" && { is_email_verified: verified }),
    },
  }).then(res => res.data);
};





export const getAdminUserDetails = async (id) => {
  const res = await api.get(`/v1/auth/admin/users/${id}/`);
  return res.data;
};


export const blockUser =async ()=> {
    await api.patch(`/v1/auth/admin/users/${id}/block/`, {
  block: true
});
}


export const unblockUser = async ()=> {
    await api.patch(`/v1/auth/admin/users/${id}/block/`, {
  block: false
});
}





export const toggleUserBlock = (userId, block) =>
  api.patch(`/v1/admin/users/${userId}/block/`, { block });



export const toggleRecruiterJobPosting = async (id, canPostJobs) => {
  const res = await api.patch(
    `/v1/admin/recruiters/${id}/job-posting/`,
    { can_post_jobs: canPostJobs }
  );
  return res.data;
};