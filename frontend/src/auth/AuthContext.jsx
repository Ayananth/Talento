// src/auth/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import api from "../apis/api";
import { saveTokens, clearTokens, getAccessToken, decodeToken } from "./authUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // user info (decoded token)
  const [loading, setLoading] = useState(true);   // true while checking existing token

  console.log("Provider running")

  // On app start: check if an access token exists and set user if valid
  useEffect(() => {
    const access = getAccessToken();
    if (!access) {
      setLoading(false);
      return;
    }
    const decoded = decodeToken(access);
    if (decoded) setUser(decoded);
    setLoading(false);
  }, []);

  // login: call backend, save tokens, set user
  const login = async ({ email, password }) => {
    // Adjust endpoint and payload to match your Django backend
    const resp = await api.post("/v1/auth/sign_in", { email, password });
    const { access, refresh } = resp.data;
    saveTokens({ access, refresh });
    const decoded = decodeToken(access);
    setUser(decoded);
    return resp;
  };

  // logout: clear tokens and user
  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
