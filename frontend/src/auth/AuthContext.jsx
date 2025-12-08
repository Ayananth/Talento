import React, { createContext, useEffect, useState, useRef } from "react";
import api from "../apis/api";
import { saveTokens, clearTokens, getAccessToken, decodeToken } from "./authUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);


  console.log("Provider running")

  // On app start: check if an access token exists and set user if valid
  useEffect(() => {
    const access = getAccessToken();

    if (access) {
      const decoded = decodeToken(access);
      if (decoded) {
        setUser(decoded);
        scheduleAutoRefresh(access);
      }
    }

    setLoading(false);

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, []);

  // --- Auto Refresh Token ---
  const scheduleAutoRefresh = (accessToken) => {
    const decoded = decodeToken(accessToken);
    if (!decoded?.exp) return;

    const expireAt = decoded.exp * 1000;
    const now = Date.now();

    const refreshIn = Math.max(expireAt - now - 30000, 0);

    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    refreshTimer.current = setTimeout(refreshAccessToken, refreshIn);

    console.log("Auto-refresh scheduled in ", refreshIn / 1000, "seconds");
  };

  const refreshAccessToken = async () => {
    try {
      const response = await api.post(
        "/v1/auth/token/refresh/",
        {},
        { withCredentials: true }
      );

      const newAccess = response.data.access;

      saveTokens({ access: newAccess });

      const decoded = decodeToken(newAccess);
      setUser(decoded);

      scheduleAutoRefresh(newAccess);

      console.log("Access token refreshed");
    } catch (err) {
      console.log("Auto refresh failed → logging out");
      logout();
    }
  };

  // --- LOGIN (role optional, default = jobseeker) ---
  const login = async ({ email, password, role = "jobseeker" }) => {
    const res = await api.post(
      "/v1/auth/sign_in",
      { email, password, role },
      { withCredentials: true }
    );

    const { access } = res.data;

    saveTokens({ access });

    const decoded = decodeToken(access);
    setUser(decoded);

    scheduleAutoRefresh(access);

    return res;
  };

  // --- GOOGLE LOGIN (role optional, default = jobseeker) ---
  const googleLogin = ({ access, refresh, role = "jobseeker" }) => {
    saveTokens({ access, refresh });

    const decoded = decodeToken(access);
    setUser(decoded);
    scheduleAutoRefresh(access);
  };

  // --- REGISTER ---
  const register = async (payload) => {
    return await api.post("/v1/auth/sign_up", payload);
  };

  // -------------------------------------------------
  // LOGOUT
  // -------------------------------------------------
  const logout = async () => {
    const role = user?.role;

    clearTokens();
    setUser(null);

    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    try {
      await api.post("/v1/auth/logout/", {}, { withCredentials: true });
    } catch (err) {}

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
