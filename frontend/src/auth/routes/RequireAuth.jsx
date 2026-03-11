import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";
export default function RequireAuth({ children, redirectTo = "/login" }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (children) return children;

  return <Outlet />;
}
