import React, { useState } from "react";
import { getCloudinaryUrl } from "../../utils/common/getCloudinaryUrl";
import api from "@/apis/api";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function FirstTimeCompanyView({ data }) {
  const [rejectReason, setRejectReason] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [modalError, setModalError] = useState("");

  const navigate = useNavigate();

  const {
    id,
    email,
    pending_data,
    draft_logo,
    draft_business_registration_doc,
    status,
    request_type,
  } = data;

  const documentUrl = getCloudinaryUrl(draft_business_registration_doc);

  /* ----------------------------------
     APPROVE
  ---------------------------------- */
  const confirmApprove = async () => {
    if (approving) return;

    try {
      setApproving(true);
      await api.patch(`/v1/recruiter/profile/${id}/approve/`);

      navigate("/admin/recruiter/approvals", {
        state: {
          toast: {
            type: "success",
            message: "Recruiter approved successfully",
          },
        },
      });
    } catch (error) {
      console.error("Approval failed:", error);
      setModalError("Failed to approve recruiter. Please try again.");
    } finally {
      setApproving(false);
      setShowApproveModal(false);
    }
  };

  /* ----------------------------------
     REJECT
  ---------------------------------- */
  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      setModalError("Rejection reason is required.");
      return;
    }

    try {
      setRejecting(true);

      await api.patch(`/v1/recruiter/profile/${id}/reject/`, {
        reason: rejectReason,
      });

      navigate("/admin/recruiter/approvals", {
        state: {
          toast: {
            type: "error",
            message: "Recruiter rejected successfully",
          },
        },
      });
    } catch (error) {
      console.error("Reject failed:", error);
      setModalError(
        error.response?.data?.detail ||
          "Failed to reject recruiter. Please try again."
      );
    } finally {
      setRejecting(false);
      setShowRejectModal(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="mb-8 p-6 rounded-xl shadow bg-white border">
        <h1 className="text-3xl font-bold mb-3">
          Company Registration Request
        </h1>

        <p className="text-gray-700">
          Recruiter: <span className="font-semibold">{email}</span>
        </p>

        <p className="mt-2">
          Status:{" "}
          <span className="bg-yellow-200 px-3 py-1 rounded-lg font-medium">
            {status}
          </span>
        </p>

        <p className="mt-2">
          Request Type:{" "}
          <span className="bg-yellow-200 px-3 py-1 rounded-lg font-medium">
            {request_type}
          </span>
        </p>
      </div>

      {/* COMPANY DETAILS */}
      <div className="bg-white border shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          Submitted Company Details
        </h2>

        {Object.entries(pending_data).map(([field, value]) => (
          <div key={field} className="mb-5">
            <div className="font-semibold text-gray-700 capitalize">
              {field.replace(/_/g, " ")}:
            </div>
            <div className="text-gray-900 mt-1">
              {value || "—"}
            </div>
          </div>
        ))}

        {/* LOGO */}
        <div className="mb-6">
          <div className="font-semibold text-gray-700">
            Company Logo:
          </div>
          {draft_logo ? (
            <img
              src={draft_logo}
              alt="company logo"
              className="h-28 mt-2 rounded shadow"
            />
          ) : (
            <div className="text-gray-500 mt-1">
              No logo uploaded
            </div>
          )}
        </div>

        {/* DOCUMENT */}
        <div className="mb-6">
          <div className="font-semibold text-gray-700">
            Business Document:
          </div>

          {documentUrl ? (
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Document
            </a>
          ) : (
            <span className="text-gray-500">
              No document uploaded
            </span>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex flex-col md:flex-row gap-5">
        <button
          onClick={() => {
            setModalError("");
            setShowApproveModal(true);
          }}
          className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow"
        >
          Approve Company
        </button>

        <div className="flex flex-col w-full md:w-auto">
          <textarea
            placeholder="Enter rejection reason..."
            className="border rounded-xl px-3 py-2 mb-3 w-full"
            value={rejectReason}
            onChange={(e) => {
              setRejectReason(e.target.value);
              setModalError("");
            }}
          />

          <button
            onClick={() => setShowRejectModal(true)}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow"
          >
            Reject Company
          </button>
        </div>
      </div>

      {/* APPROVE MODAL */}
      <ConfirmModal
        open={showApproveModal}
        loading={approving}
        title="Approve Recruiter"
        description="Are you sure you want to approve this company? This action cannot be undone."
        onClose={() => setShowApproveModal(false)}
        onConfirm={confirmApprove}
      />

      {/* REJECT MODAL */}
      <ConfirmModal
        open={showRejectModal}
        loading={rejecting}
        title="Reject Recruiter"
        description={
          modalError ||
          "Are you sure you want to reject this company?"
        }
        onClose={() => setShowRejectModal(false)}
        onConfirm={confirmReject}
      />
    </div>
  );
}
