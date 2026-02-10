import api from "@/apis/api";

const PRIMARY_TICKETS_BASE = "/api/support/tickets/";
const FALLBACK_TICKETS_BASE = "/v1/support/tickets/";

const isNotFoundError = (error) => error?.response?.status === 404;

async function requestWithBaseFallback(requestFn) {
  // Prefer `/api` endpoints and fallback to `/v1` for current backend wiring.
  try {
    return await requestFn(PRIMARY_TICKETS_BASE);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
    return requestFn(FALLBACK_TICKETS_BASE);
  }
}

export const getJobseekerTickets = async ({ page = 1, status = "" } = {}) => {
  const response = await requestWithBaseFallback((baseUrl) =>
    api.get(baseUrl, {
      params: {
        page,
        ...(status && { status }),
      },
    })
  );
  return response.data;
};

export const createJobseekerTicket = async ({ subject, message }) => {
  const response = await requestWithBaseFallback((baseUrl) =>
    api.post(baseUrl, { subject, message })
  );
  return response.data;
};

export const getJobseekerTicketDetail = async (ticketId) => {
  const response = await requestWithBaseFallback((baseUrl) =>
    api.get(`${baseUrl}${ticketId}/`)
  );
  return response.data;
};

export const replyJobseekerTicket = async (ticketId, message) => {
  const response = await requestWithBaseFallback((baseUrl) =>
    api.post(`${baseUrl}${ticketId}/reply/`, { message })
  );
  return response.data;
};
