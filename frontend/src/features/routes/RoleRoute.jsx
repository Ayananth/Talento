import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../auth/context/useAuth";

export default function RoleRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user.role)
    ? <Outlet />
    : <Navigate to="/not-authorized" replace />;
}
