import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
export default function RedirectIfAuth({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    if (user.role === "jobseeker") return <Navigate to="/" replace />;
    if (user.role === "recruiter") return <Navigate to="/recruiter/" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}
