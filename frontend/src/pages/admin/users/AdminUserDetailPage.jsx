import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";


import { getAdminUserDetails, toggleRecruiterJobPosting } from "@/apis/admin/users";

import { toggleUserBlock } from "@/apis/admin/users";
import { formatDateTime } from "@/utils/common/utils";

/* ---------------------------------------------------
   CONFIRMATION MODAL
--------------------------------------------------- */
function ConfirmModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded text-white
              ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
          >
            {loading ? "Please wait…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   MAIN PAGE
--------------------------------------------------- */
export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [jobPostingConfirmOpen, setJobPostingConfirmOpen] = useState(false);
  const [jobPostingLoading, setJobPostingLoading] = useState(false);


  const location = useLocation();

  /* ---------------------------------------------------
     FETCH USER
  --------------------------------------------------- */
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

  /* ---------------------------------------------------
     BLOCK / UNBLOCK
  --------------------------------------------------- */
  const handleConfirmBlock = async () => {
    if (!user) return;

    try {
      setActionLoading(true);

      await toggleUserBlock(id, !user.is_blocked);

      // Update UI locally (no refetch needed)
      setUser((prev) => ({
        ...prev,
        is_blocked: !prev.is_blocked,
      }));

      setConfirmOpen(false);
    } catch (err) {
      console.error("Failed to update user status", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading user details…
      </div>
    );
  }

  if (!user) return null;


  const handleToggleJobPosting = async () => {
    try {
      setJobPostingLoading(true);

      const recruiterId = user.recruiter_profile.id;

      await toggleRecruiterJobPosting(
        recruiterId,
        !user.recruiter_profile.can_post_jobs
      );

      // Update UI locally
      setUser((prev) => ({
        ...prev,
        recruiter_profile: {
          ...prev.recruiter_profile,
          can_post_jobs: !prev.recruiter_profile.can_post_jobs,
        },
      }));

      setJobPostingConfirmOpen(false);
    } catch (err) {
      console.error("Failed to toggle job posting", err);
    } finally {
      setJobPostingLoading(false);
    }
  };


  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */
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
            user.is_blocked ? (
              <StatusBadge text="Blocked" color="red" />
            ) : (
              <StatusBadge text="Active" color="green" />
            )
          }
        />

        <Info
          label="Email Verified"
          value={user.is_email_verified ? "Yes" : "No"}
        />
        <Info label="Date Joined" value={formatDateTime(user.date_joined)} />
        <Info label="Last Login" value={formatDateTime(user.last_login)} />
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
      label="Job Posting Access"
      value={
        user.recruiter_profile.can_post_jobs ? (
          <StatusBadge text="Enabled" color="green" />
        ) : (
          <StatusBadge text="Disabled" color="red" />
        )
      }
    />

    {/* ACTION BUTTON */}
    <div className="pt-4">
      <button
        onClick={() => setJobPostingConfirmOpen(true)}
        className={`px-4 py-2 text-sm rounded text-white
          ${
            user.recruiter_profile.can_post_jobs
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }
        `}
      >
        {user.recruiter_profile.can_post_jobs
          ? "Disable Job Posting"
          : "Enable Job Posting"}
      </button>
    </div>
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
{user.role !== "admin" && (
  <div className="mt-8 flex gap-4">
    <button
      onClick={() => setConfirmOpen(true)}
      className={`px-6 py-2 rounded text-white
        ${
          user.is_blocked
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }
      `}
    >
      {user.is_blocked ? "Unblock User" : "Block User"}
    </button>
  </div>
)}




      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) setConfirmOpen(false);
        }}
        onConfirm={handleConfirmBlock}
        title={user.is_blocked ? "Unblock User" : "Block User"}
        description={
          user.is_blocked
            ? "Are you sure you want to unblock this user?"
            : "Are you sure you want to block this user? They will be logged out immediately."
        }
      />

{user.role === "recruiter" && user.recruiter_profile && (
  <ConfirmModal
    open={jobPostingConfirmOpen}
    loading={jobPostingLoading}
    onClose={() => {
      if (!jobPostingLoading) setJobPostingConfirmOpen(false);
    }}
    onConfirm={handleToggleJobPosting}
    title={
      user.recruiter_profile.can_post_jobs
        ? "Disable Job Posting"
        : "Enable Job Posting"
    }
    description={
      user.recruiter_profile.can_post_jobs
        ? "This recruiter will not be able to post new jobs."
        : "This recruiter will be allowed to post new jobs."
    }
  />
)}


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
