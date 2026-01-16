import React, { createContext, useEffect, useState, useRef } from "react";
import api from "../../apis/api";
import { saveTokens, clearTokens, getAccessToken, decodeToken } from "./authUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);
  const [subscription, setSubscription] = useState(null);



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
  const res = await api.post("/v1/auth/signin", { email, password, role }, { withCredentials: true });

  const { access } = res.data;

  saveTokens({ access });

  const decoded = decodeToken(access);
  setUser(decoded);

  scheduleAutoRefresh(access);
  await fetchSubscription();
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
    let error = {
      message: "Signup failed. Please try again.",
      fields: {},
    };

    if (err.response?.data) {
      const data = err.response.data;

      if (typeof data === "object") {
        Object.keys(data).forEach((key) => {
          if (Array.isArray(data[key])) {
            error.fields[key] = data[key][0];
          }
        });
      }

      if (data.detail) error.message = data.detail;
      else if (data.message) error.message = data.message;
      else if (data.error) error.message = data.error;  
    } 
    else if (err.request) {
      error.message = "Server not reachable. Please try again later.";
    }

    throw error;
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
