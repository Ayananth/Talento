import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function RoleRoute({ children, allowedRoles }) {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" />;

  console.log(allowedRoles)
  console.log(user)
  console.log(user.role)


  if (!allowedRoles.includes(user.role)) {
    logout()
    return <Navigate to="/notfound" />;
  }

  return children;
}
