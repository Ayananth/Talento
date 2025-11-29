import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

const RedirectIfAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RedirectIfAuth;
