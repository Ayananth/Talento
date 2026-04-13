import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
import LoadingScreen from "@/components/common/LoadingScreen";
export default function RoleRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen label="Loading…" />;

  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user.role)
    ? <Outlet />
    : <Navigate to="/not-authorized" replace />;
}
