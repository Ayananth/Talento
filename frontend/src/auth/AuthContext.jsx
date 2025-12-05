import React, { createContext, useEffect, useState, useRef } from "react";
import api from "../apis/api";
import {
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  decodeToken,
} from "./authUtils";

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

    // Cleanup on unmount
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, []);

  // --- Auto Refresh Token ---
  const scheduleAutoRefresh = (accessToken) => {
    if (!accessToken) return;

    const decoded = decodeToken(accessToken);
    if (!decoded || !decoded.exp) return;

    const expireTime = decoded.exp * 1000; // seconds → ms
    const currentTime = Date.now();
    const timeUntilExpire = expireTime - currentTime;

    const refreshIn = Math.max(timeUntilExpire - 30000, 0); // 30s before expiry

    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    refreshTimer.current = setTimeout(() => {
      refreshAccessToken();
    }, refreshIn);

    console.log("Auto-refresh scheduled in:", refreshIn / 1000, "seconds");
  };

  const refreshAccessToken = async () => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) throw new Error("No refresh token");

      const response = await api.post("/v1/auth/token/refresh/", { refresh });

      const newAccess = response.data.access;
      const newRefresh = response.data.refresh || refresh;

      saveTokens({ access: newAccess, refresh: newRefresh });

      const decoded = decodeToken(newAccess);
      setUser(decoded);

      scheduleAutoRefresh(newAccess);

      console.log("Access token refreshed!");
    } catch (err) {
      console.log(" Auto-refresh failed. Logging out.");
      logout();
    }
  };

  // --- LOGIN (role optional, default = jobseeker) ---
  const login = async ({ email, password, role = "jobseeker" }) => {
    const resp = await api.post("/v1/auth/sign_in", { email, password, role });

    const { access, refresh } = resp.data;

    saveTokens({ access, refresh });

    const decoded = decodeToken(access);
    setUser(decoded);

    scheduleAutoRefresh(access);

    return resp;
  };

  // --- GOOGLE LOGIN (role optional, default = jobseeker) ---
  const googleLogin = ({ access, refresh, role = "jobseeker" }) => {
    saveTokens({ access, refresh });

    const decoded = decodeToken(access);
    console.log("decoded", decoded);

    setUser(decoded);
    scheduleAutoRefresh(access);
  };

  // --- REGISTER ---
  const register = async (payload) => {
    const resp = await api.post("/v1/auth/sign_up", payload);
    return resp;
  };

  // --- LOGOUT ---
  const logout = () => {
      const role = user?.role;   // save role before clearing user

      clearTokens();
      setUser(null);

      if (refreshTimer.current) clearTimeout(refreshTimer.current);

      console.log("role from logout", role)

      if (role === "recruiter") window.location.href = "/recruiter/login";
      else if (role === "admin") window.location.href = "/admin/login";
      else window.location.href = "/login";
      
      };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
