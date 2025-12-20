import api from "../api";

/**
 * Fetch recruiter profile for admin review
 */
export const getAdminRecruiterProfile = async (id) => {
  const res = await api.get(`/v1/recruiter/admin/recruiter/${id}/`);
  return res.data;
};

/**
 * Approve recruiter profile
 */
export const approveRecruiterProfile = async (id) => {
  const res = await api.patch(
    `/v1/recruiter/profile/${id}/approve/`
  );
  return res.data;
};

/**
 * Reject recruiter profile
 */
export const rejectRecruiterProfile = async (id, reason) => {
  const res = await api.patch(
    `/v1/recruiter/profile/${id}/reject/`,
    { reason: reason }
  );
  return res.data;
};
