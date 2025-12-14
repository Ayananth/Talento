import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
export default function RoleRoute({ allowedRoles }) {
  return <Outlet/>
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user.role)
    ? <Outlet />
    : <Navigate to="/not-authorized" replace />;
}
