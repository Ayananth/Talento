import api from "@/apis/api";

export const getRecruiterDetails = async (id) => {
  try {
    const res = await api.get(`/v1/recruiter/admin/recruiter/${id}/`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch recruiter details", error);
    throw error;
  }
};


