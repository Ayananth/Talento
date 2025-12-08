import axios from "axios";
import { API_BASE_URL } from "../constants";
import { getAccessToken, saveTokens, clearTokens } from "../auth/authUtils";

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
  console.log("➡️ API Request:", config.method?.toUpperCase(), config.url);
  return config;
});

// Handle 401 errors (expired access token)
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      clearTokens();
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      console.log("Attempting access token refresh...");

      // Refresh token is sent automatically via cookie
      const response = await axios.post(
        `${API_BASE_URL}/v1/auth/token/refresh/`,
        {},
        { withCredentials: true }
      );

      const newAccess = response.data.access;

      saveTokens({ access: newAccess });

      // Retry original request with new access token
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);

    } catch (err) {
      console.log("Auto refresh failed → logging out.");
      clearTokens();
      return Promise.reject(err);
    }
  }
);

export default api;
