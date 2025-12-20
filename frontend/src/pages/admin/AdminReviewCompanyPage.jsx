import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAdminRecruiterProfile,
  approveRecruiterProfile,
  rejectRecruiterProfile,
} from "../../apis/admin/recruiters"
import { getCloudinaryUrl } from "../../utils/common/getCloudinaryUrl";
import Toast from "@/components/common/Toast"; // adjust path if needed


/**
 * Highlight class depending on difference between published and pending
 */
const highlightClass = (live, pending) => {
  if (pending === undefined || pending === null) return "";
  if (!live && pending) return "bg-green-100";     // New field
  if (live && !pending) return "bg-red-100";       // Removed field
  if (live !== pending) return "bg-yellow-100";    // Changed field
  return "";
};

export default function AdminReviewCompanyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

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

  /* -------------------------
     Approve / Reject
  ------------------------- */
  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await approveRecruiterProfile(data.id);
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
      alert("Failed to approve profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Rejection reason is required");
      return;
    }

    setSubmitting(true);
    try {
      await rejectRecruiterProfile(data.id, rejectReason);
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
      alert("Failed to reject profile");
    } finally {
      setSubmitting(false);
    }
  };

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

      {/* Comparison Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LIVE DATA */}
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

          {/* Published Logo */}
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

          {/* Published Doc */}
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

        {/* PENDING DATA */}
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

          {/* Draft Logo */}
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

          {/* Draft Doc */}
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
      <div className="mt-10 flex flex-col md:flex-row gap-4 justify-between">
        <button
          disabled={submitting}
          onClick={handleApprove}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Approve Changes
        </button>

        <div className="flex flex-col w-full md:w-auto">
          <textarea
            placeholder="Enter rejection reason..."
            className="border rounded-xl px-3 py-2 mb-3 w-full"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <button
            disabled={submitting}
            onClick={handleReject}
            className="bg-red-600 text-white px-6 py-3 rounded-xl"
          >
            Reject Changes
          </button>
        </div>
      </div>
    </div>
  );
}
