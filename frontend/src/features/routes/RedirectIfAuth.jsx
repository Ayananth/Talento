import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../auth/context/useAuth";

export default function RedirectIfAuth({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    if (user.role === "jobseeker") return <Navigate to="/" replace />;
    if (user.role === "recruiter") return <Navigate to="/recruiter/home" replace />;
    if (user.role === "admin") return <Navigate to="/admin/home" replace />;
  }

  return children;
}
