import axios from "axios";
import { API_BASE_URL } from "../constants/constants";
import { getAccessToken, saveTokens, clearTokens } from '../auth/context/authUtils'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach access token to all requests
api.interceptors.request.use((config) => {
  const access = getAccessToken();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Handle 401 errors (expired access token)
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const detail = String(error.response?.data?.detail || "").toLowerCase();

    // FORBIDDEN: only force logout for blocked-account responses.
    // Other 403 cases (e.g., premium-only endpoint) should be handled by screens.
    if (status === 403) {
      const isBlockedError = detail.includes("blocked");

      if (isBlockedError) {
        clearTokens();

        // avoid infinite loop
        if (!originalRequest._forcedLogout) {
          originalRequest._forcedLogout = true;
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }

    //  ACCESS TOKEN EXPIRED
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      console.log("Attempting access token refresh...");

      const response = await axios.post(
        `${API_BASE_URL}/v1/auth/token/refresh/`,
        {},
        { withCredentials: true }
      );

      const newAccess = response.data.access;
      saveTokens({ access: newAccess });

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);

    } catch (err) {
      console.log("Refresh failed → logging out");
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);


export default api;
