import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminUserDetails } from "@/apis/admin/users";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getAdminUserDetails(id);
        console.log(res)
        setUser(res);
      } catch (err) {
        console.error("Failed to load user", err);
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading user details…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          User Details
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* BASIC INFO */}
      <Card title="Basic Information">
        <Info label="Email" value={user.email} />
        <Info label="Username" value={user.username || "—"} />
        <Info label="Role" value={user.role_display} />
        <Info
          label="Account Status"
          value={
            user.is_active ? (
              <StatusBadge text="Active" color="green" />
            ) : (
              <StatusBadge text="Blocked" color="red" />
            )
          }
        />
        <Info
          label="Email Verified"
          value={user.is_email_verified ? "Yes" : "No"}
        />
      </Card>

      {/* ROLE SPECIFIC */}
      {user.role === "recruiter" && user.recruiter_profile && (
        <Card title="Recruiter Profile">
          <Info
            label="Company Name"
            value={user.recruiter_profile.company_name || "—"}
          />
          <Info
            label="Verification Status"
            value={user.recruiter_profile.status}
          />
          <Info
            label="Verified At"
            value={user.recruiter_profile.verified_at || "—"}
          />
        </Card>
      )}

      {user.role === "jobseeker" && user.jobseeker_profile && (
        <Card title="Jobseeker Profile">
          <Info
            label="Full Name"
            value={user.jobseeker_profile.fullname || "—"}
          />
          <Info
            label="Experience"
            value={`${user.jobseeker_profile.experience_years} years`}
          />
        </Card>
      )}

      {/* ACTIONS */}
      <div className="mt-8 flex gap-4">
        <button
          className={`px-6 py-2 rounded text-white
            ${
              user.is_active
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
          onClick={() =>
            alert(
              user.is_active
                ? "Block user (next step)"
                : "Unblock user (next step)"
            )
          }
        >
          {user.is_active ? "Block User" : "Unblock User"}
        </button>
      </div>

    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

const Card = ({ title, children }) => (
  <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const StatusBadge = ({ text, color }) => (
  <span
    className={`px-3 py-1 rounded text-sm font-medium
      ${
        color === "green"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
  >
    {text}
  </span>
);
