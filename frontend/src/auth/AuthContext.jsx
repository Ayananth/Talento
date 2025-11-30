import React, { createContext, useEffect, useState } from "react";
import api from "../apis/api";
import { saveTokens, clearTokens, getAccessToken, decodeToken } from "./authUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // user info (decoded token)
  const [loading, setLoading] = useState(true);   // true while checking existing token
  const refreshTimer = useRef(null);

  console.log("Provider running")

  // On app start: check if an access token exists and set user if valid
  useEffect(() => {
    const access = getAccessToken();
    if (!access) {
      setLoading(false);
      return;
    }
    const decoded = decodeToken(access);
    if (decoded) {
      setUser(decoded);
      scheduleAutoRefresh(access);
    }
      setLoading(false);
  }, []);


  // Auto Refresh token
  const scheduleAutoRefresh = (accessToken) => {
    if (!accessToken) return;

    const decoded = decodeToken(accessToken);
    if (!decoded || !decoded.exp) return;

    const expireTime = decoded.exp * 1000; // convert sec → ms
    const currentTime = Date.now();

    const timeUntilExpire = expireTime - currentTime;

    // Refresh 30 seconds before expiry
    const refreshIn = Math.max(timeUntilExpire - 30000, 0);

    // Clear existing timer
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }

    refreshTimer.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshIn);

    console.log("⏲️ Auto-refresh scheduled in:", refreshIn / 1000, "seconds");
  };

  const refreshAccessToken = async () => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) throw new Error("No refresh token");

      const response = await api.post("/v1/auth/token/refresh/", {
        refresh,
      });

      const newAccess = response.data.access;
      const newRefresh = response.data.refresh || refresh;

      saveTokens({ access: newAccess, refresh: newRefresh });

      const decoded = decodeToken(newAccess);
      setUser(decoded);

      // Schedule next refresh
      scheduleAutoRefresh(newAccess);

      console.log("🔄 Access token refreshed!");
    } catch (err) {
      console.log(" Auto-refresh failed. Logging out.");
      logout();
    }
  };

  // login: call backend, save tokens, set user
  const login = async ({ email, password }) => {
    const resp = await api.post("/v1/auth/sign_in", { email, password });
    const { access, refresh } = resp.data;
    saveTokens({ access, refresh });
    const decoded = decodeToken(access);
    setUser(decoded);
    scheduleAutoRefresh(access);
    return resp;
  };

  // Signup/register function
  const register = async (payload) => {
    const resp = await api.post("/v1/auth/sign_up", payload);
    return resp;
  };


  // logout: clear tokens and user
  const logout = () => {
    clearTokens();
    setUser(null);
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }

  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
