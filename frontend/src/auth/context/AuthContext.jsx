import React, { createContext, useEffect, useState, useRef } from "react";
import api from "../../apis/api";
import { saveTokens, clearTokens, getAccessToken, decodeToken } from "./authUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);
  const [subscription, setSubscription] = useState(null);

  const normalizeAuthError = (err, fallbackMessage) => {
    const error = {
      message: fallbackMessage,
      fields: {},
    };

    const status = err?.response?.status;
    const data = err?.response?.data;

    const normalizeText = (value) => {
      if (!value) return "";
      if (Array.isArray(value)) return String(value[0] ?? "").trim();
      return String(value).trim();
    };

    if (data) {
      if (typeof data === "string") {
        const clean = data.trim();
        if (clean && !/^\d{3}$/.test(clean)) {
          error.message = clean;
        }
      } else if (typeof data === "object") {
        Object.keys(data).forEach((key) => {
          const value = data[key];
          if (Array.isArray(value) || typeof value === "string") {
            if (!["detail", "message", "error", "status", "code", "non_field_errors"].includes(key)) {
              error.fields[key] = normalizeText(value);
            }
          }
        });

        const detail =
          normalizeText(data.detail) ||
          normalizeText(data.message) ||
          normalizeText(data.error) ||
          normalizeText(data.non_field_errors);

        if (detail && !/^\d{3}$/.test(detail)) {
          error.message = detail;
        }
      }
    } else if (err?.request) {
      error.message = "Server not reachable. Please try again later.";
    }

    if (error.message === fallbackMessage && status) {
      if (status === 400) error.message = "Invalid request. Please check your details and try again.";
      if (status === 401) error.message = "Invalid email or password.";
      if (status === 403) error.message = "Your account is not allowed to sign in right now.";
      if (status >= 500) error.message = "Server error. Please try again in a few minutes.";
    }

    return error;
  };


  // On app start: check if an access token exists and set user if valid
useEffect(() => {
  const init = async () => {
    const access = getAccessToken();

    if (access) {
      const decoded = decodeToken(access);
      if (decoded) {
        setUser(decoded);
        scheduleAutoRefresh(access);
        await fetchSubscription();
      }
    }

    setLoading(false);
  };

  init();

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

    console.log("Auto-refresh scheduled in ");
  };

const refreshAccessToken = async () => {
  const res = await api.post("/v1/auth/token/refresh/", {}, { withCredentials: true });
  const newAccess = res.data.access;

  saveTokens({ access: newAccess });

  const decoded = decodeToken(newAccess);
  setUser(decoded);

  scheduleAutoRefresh(newAccess);
  await fetchSubscription();
};


  // --- LOGIN (role optional, default = jobseeker) ---
const login = async ({ email, password, role = "jobseeker" }) => {
  try {
    const res = await api.post("/v1/auth/signin", { email, password, role }, { withCredentials: true });

    const { access } = res.data;

    saveTokens({ access });

    const decoded = decodeToken(access);
    setUser(decoded);

    scheduleAutoRefresh(access);
    await fetchSubscription();
  } catch (err) {
    throw normalizeAuthError(err, "Login failed. Please check your credentials and try again.");
  }
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
  try {
    const res = await api.post("/v1/auth/sign_up", payload);
    return res;
  } catch (err) {
    throw normalizeAuthError(err, "Signup failed. Please try again.");
  }
};



  // -------------------------------------------------
  // LOGOUT
  // -------------------------------------------------
  const logout = async () => {
    const role = user?.role;

    clearTokens();
    setUser(null);
    setSubscription(null);

    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    try {
      await api.post("/v1/auth/signout/", {}, { withCredentials: true });
    } catch (err) {}

    if (role === "recruiter") window.location.href = "/recruiter/login";
    else if (role === "admin") window.location.href = "/admin/login";
    else window.location.href = "/login";
  };



  const fetchSubscription = async () => {
  try {
    const res = await api.get("v1/subscriptions/status/", {
      withCredentials: true,
    });
    setSubscription(res.data);
  } catch (err) {
    setSubscription(null);
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        fetchSubscription,
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