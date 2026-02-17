import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

import {
  getAdminRecruiterProfile,
  approveRecruiterProfile,
  rejectRecruiterProfile,
} from "@/apis/admin/recruiters";

import { getCloudinaryUrl } from "@/utils/common/getCloudinaryUrl";
import ConfirmModal from "@/components/common/ConfirmModal";
import Toast from "@/components/common/Toast"; 

/* ----------------------------------------
   Highlight helper
---------------------------------------- */
const highlightClass = (live, pending) => {
  if (pending === undefined || pending === null) return "";
  if (!live && pending) return "bg-green-100";
  if (live && !pending) return "bg-red-100";
  if (live !== pending) return "bg-yellow-100";
  return "";
};

export default function AdminReviewCompanyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [modalError, setModalError] = useState("");

const { pending, fetchPendingCounts } = useAdmin();
  

  /* ----------------------------------------
     Fetch profile
  ---------------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getAdminRecruiterProfile(id);
        setData(res);
      } catch (err) {
        console.error("Failed to load recruiter profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">Loading recruiter profile…</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">Profile not found</div>;
  }

  const {
    company_name,
    website,
    industry,
    company_size,
    logo,
    about_company,
    phone,
    support_email,
    location,
    address,
    linkedin,
    facebook,
    twitter,
    business_registration_doc,
    pending_data = {},
    draft_logo,
    draft_business_registration_doc,
    status,
    request_type,
    email,
  } = data;

  const published_data = {
    company_name,
    website,
    industry,
    company_size,
    about_company,
    phone,
    support_email,
    location,
    address,
    linkedin,
    facebook,
    twitter,
  };

  /* ----------------------------------------
     Approve / Reject handlers
  ---------------------------------------- */
  const handleApproveConfirm = async () => {
    setSubmitting(true);
    try {
      await approveRecruiterProfile(data.id);
      await fetchPendingCounts();
      navigate("/admin/recruiter/approvals", {
        state: {
          toast: {
            message: "Profile approved successfully",
            type: "success",
          },
        },
      });
    } catch (err) {
      console.error(err);
      setModalError("Failed to approve profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      setModalError("Rejection reason is required");
      return;
    }

    setSubmitting(true);
    try {
      await rejectRecruiterProfile(data.id, rejectReason);
      await fetchPendingCounts();
      navigate("/admin/recruiter/approvals", {
        state: {
          toast: {
            message: "Profile rejected successfully",
            type: "success",
          },
        },
      });
    } catch (err) {
      console.error(err);
      setModalError("Failed to reject profile");
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------------------
     Render
  ---------------------------------------- */
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 p-6 rounded-xl shadow bg-white border">
        <h1 className="text-3xl font-bold mb-2">
          {pending_data.company_name || company_name}
        </h1>

        <p className="text-gray-700">
          Recruiter: <span className="font-semibold">{email}</span>
        </p>

        <p className="text-gray-700 mt-1">
          Status:{" "}
          <span className="px-3 py-1 bg-yellow-200 rounded-lg font-medium">
            {status}
          </span>
        </p>

        <p className="text-gray-700 mt-1">
          Request Type:{" "}
          <span className="font-semibold">{request_type}</span>
        </p>
      </div>

      {/* Comparison panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Published */}
        <div className="border rounded-xl p-6 bg-gray-50">
          <h2 className="text-xl font-bold mb-4">
            Current Published Data
          </h2>

          {Object.entries(published_data).map(([field, value]) => (
            <div key={field} className="mb-4">
              <div className="font-semibold capitalize">
                {field.replace(/_/g, " ")}:
              </div>
              <div>{value || "—"}</div>
            </div>
          ))}

          <div className="mb-4">
            <div className="font-semibold">Logo:</div>
            {logo ? (
              <img
                src={getCloudinaryUrl(logo)}
                alt="logo"
                className="h-24 mt-2 rounded"
              />
            ) : (
              <div className="text-gray-500">—</div>
            )}
          </div>

          <div className="mb-4">
            <div className="font-semibold">Business Document:</div>
            {business_registration_doc ? (
              <a
                href={getCloudinaryUrl(business_registration_doc)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            ) : (
              <div className="text-gray-500">—</div>
            )}
          </div>
        </div>

        {/* Pending */}
        <div className="border rounded-xl p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">
            Requested Changes
          </h2>

          {Object.entries(pending_data).map(([field, value]) => (
            <div
              key={field}
              className={`mb-4 p-2 rounded ${highlightClass(
                published_data[field],
                value
              )}`}
            >
              <div className="font-semibold capitalize">
                {field.replace(/_/g, " ")}:
              </div>
              <div>{value || "—"}</div>
            </div>
          ))}

          <div className={`mb-4 p-2 rounded ${draft_logo ? "bg-yellow-100" : ""}`}>
            <div className="font-semibold">Logo (New):</div>
            {draft_logo ? (
              <img
                src={getCloudinaryUrl(draft_logo)}
                alt="draft logo"
                className="h-24 mt-2 rounded"
              />
            ) : (
              <div className="text-gray-500">—</div>
            )}
          </div>

          <div
            className={`mb-4 p-2 rounded ${
              draft_business_registration_doc ? "bg-yellow-100" : ""
            }`}
          >
            <div className="font-semibold">Business Document (New):</div>
            {draft_business_registration_doc ? (
              <a
                href={getCloudinaryUrl(draft_business_registration_doc)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            ) : (
              <div className="text-gray-500">—</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => {
            setModalError("");
            setApproveOpen(true);
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Approve Changes
        </button>

        <button
          onClick={() => {
            setModalError("");
            setRejectOpen(true);
          }}
          className="bg-red-600 text-white px-6 py-3 rounded-xl"
        >
          Reject Changes
        </button>
      </div>

      {/* Approve modal */}
      <ConfirmModal
        open={approveOpen}
        title="Approve Recruiter Profile"
        description="Are you sure you want to approve these changes?"
        confirmText="Approve"
        loading={submitting}
        error={modalError}
        onClose={() => setApproveOpen(false)}
        onConfirm={handleApproveConfirm}
      />

      {/* Reject modal */}
      <ConfirmModal
        open={rejectOpen}
        title="Reject Recruiter Profile"
        description="Please provide a rejection reason."
        confirmText="Reject"
        loading={submitting}
        error={modalError}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleRejectConfirm}
      >
        <textarea
          rows={4}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Enter rejection reason..."
          value={rejectReason}
          onChange={(e) => {
            setRejectReason(e.target.value);
            setModalError("");
          }}
        />
      </ConfirmModal>
    </div>
  );
}
