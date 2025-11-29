import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    console.log("Protected route checking")
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) return <div>Loading...</div>;

  console.log(isAuthenticated)

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
