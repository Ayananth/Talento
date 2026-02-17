import api from "@/apis/api";

const TICKETS_BASE = "/v1/support/tickets/";

export const getRecruiterTickets = async ({ page = 1, status = "" } = {}) => {
  const response = await api.get(TICKETS_BASE, {
    params: {
      page,
      ...(status && { status }),
    },
  });
  return response.data;
};

export const createRecruiterTicket = async ({ subject, message }) => {
  const response = await api.post(TICKETS_BASE, {
    subject,
    message,
  });
  return response.data;
};

export const getRecruiterTicketDetail = async (ticketId) => {
  const response = await api.get(`${TICKETS_BASE}${ticketId}/`);
  return response.data;
};

export const replyRecruiterTicket = async (ticketId, message) => {
  const response = await api.post(`${TICKETS_BASE}${ticketId}/reply/`, {
    message,
  });
  return response.data;
};
