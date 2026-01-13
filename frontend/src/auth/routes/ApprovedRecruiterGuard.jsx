import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

/**
 * Allows access ONLY if:
 * - User is logged in
 * - User role is recruiter
 * - Recruiter has published data (approved at least once)
 */
export default function ApprovedRecruiterGuard() {
  const { user, recruiterProfile, loading } = useAuth();

  // While auth/profile is loading, avoid flicker
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking access...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/recruiter/login" replace />;
  }

  // Logged in but wrong role
  if (user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  /**
   * Core rule:
   * Recruiter must have at least one approved (published) profile
   * Even if they are currently editing and status = pending/rejected,
   * old published data is still valid.
   */
  if (!recruiterProfile?.has_published_data) {
    return <Navigate to="/recruiter" replace />;
  }

  return <Outlet />;
}
