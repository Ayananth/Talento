import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();


  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on their actual role
    if (user.role === "jobseeker") return <Navigate to="/" replace />;
    if (user.role === "recruiter") return <Navigate to="/recruiter" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;

    return <Navigate to="/notfound" replace />;
  }

  return children;
}
