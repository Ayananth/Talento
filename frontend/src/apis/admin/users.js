import api from "@/apis/api";

export const getAdminUsers = async (page = 1, ordering = "") => {
  const res = await api.get("/v1/auth/admin/users/", {
    params: {
      page,
      ordering,
    },
  });

  return res.data;
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

