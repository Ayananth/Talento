import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
import LoadingScreen from "@/components/common/LoadingScreen";
export default function RedirectIfAuth({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen label="Loading…" />;

  if (isAuthenticated) {
    if (user.role === "jobseeker") return <Navigate to="/" replace />;
    if (user.role === "recruiter") return <Navigate to="/recruiter/" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}
