import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../apis";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const access = localStorage.getItem(ACCESS_TOKEN);

    if (!access) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded = jwtDecode(access);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        await refreshTokens();
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const refreshTokens = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);

    if (!refresh) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await api.post("/v1/auth/token/refresh", {
        refresh: refresh,
      });

      localStorage.setItem(ACCESS_TOKEN, res.data.access);

      if (res.data.refresh) {
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      }

      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
