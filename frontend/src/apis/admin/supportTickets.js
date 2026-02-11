import api from "@/apis/api";

const TICKETS_BASE = "/v1/support/tickets/";

export const getAdminTickets = async ({
  page = 1,
  ordering = "-created_at",
  status = "",
} = {}) => {
  const response = await api.get(TICKETS_BASE, {
    params: {
      page,
      ...(ordering && { ordering }),
      ...(status && { status }),
    },
  });

  return response.data;
};

export const getAdminTicketDetail = async (ticketId) => {
  const response = await api.get(`${TICKETS_BASE}${ticketId}/`);
  return response.data;
};

export const replyToTicket = async (ticketId, message) => {
  const response = await api.post(`${TICKETS_BASE}${ticketId}/reply/`, {
    message,
  });
  return response.data;
};

export const updateTicketStatus = async (ticketId, status) => {
  const response = await api.patch(`${TICKETS_BASE}${ticketId}/`, {
    status,
  });
  return response.data;
};
