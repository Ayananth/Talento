import axios from "axios";
import { API_BASE_URL } from "../constants";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "../auth/authUtils";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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

    // Not a 401 → nothing to do
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // Try refresh token
    try {
      const refresh = getRefreshToken();
      if (!refresh) throw new Error("No refresh token");

      const response = await axios.post(`${API_BASE_URL}/v1/auth/token/refresh/`, {
        refresh: refresh,
      });

      const newAccess = response.data.access;
      const newRefresh = response.data.refresh || refresh;

      // Save new tokens
      saveTokens({ access: newAccess, refresh: newRefresh });

      // Retry original request with new access token
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);

    } catch (err) {
      // Refresh failed → logout user
      clearTokens();
      return Promise.reject(err);
    }
  }
);

export default api;
