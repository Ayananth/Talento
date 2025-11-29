import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp > now) {
        return <Navigate to="/" />;
      }
    } catch (err) {
    }
  }

  return children;
}
