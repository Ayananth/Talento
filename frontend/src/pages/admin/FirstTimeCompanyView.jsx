import React, { useState } from "react";

export default function FirstTimeCompanyView({ data }) {
  const [rejectReason, setRejectReason] = useState("");

  const {
    user,
    pending_data,
    draft_logo,
    draft_business_registration_doc,
    status,
  } = data;

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-8 p-6 rounded-xl shadow bg-white border">
        <h1 className="text-3xl font-bold mb-3">Company Registration Request</h1>

        <p className="text-gray-700">
          Recruiter: <span className="font-semibold">{user.email}</span>
        </p>

        <p className="mt-2">
          Status:{" "}
          <span className="bg-yellow-200 px-3 py-1 rounded-lg font-medium">
            {status}
          </span>
        </p>
      </div>

      {/* COMPANY DETAILS CARD */}
      <div className="bg-white border shadow rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-6">Submitted Company Details</h2>

        {/* List all pending fields */}
        {Object.entries(pending_data).map(([field, value]) => (
          <div key={field} className="mb-5">
            <div className="font-semibold text-gray-700 capitalize">
              {field.replace(/_/g, " ")}:
            </div>
            <div className="text-gray-900 mt-1">{value || "—"}</div>
          </div>
        ))}

        {/* Draft Logo */}
        <div className="mb-6">
          <div className="font-semibold text-gray-700">Company Logo:</div>
          {draft_logo ? (
            <img
              src={draft_logo}
              alt="company logo"
              className="h-28 mt-2 rounded shadow"
            />
          ) : (
            <div className="text-gray-500 mt-1">No logo uploaded</div>
          )}
        </div>

        {/* Draft Business Document */}
        <div className="mb-6">
          <div className="font-semibold text-gray-700">Business Document:</div>
          {draft_business_registration_doc ? (
            <a
              href={draft_business_registration_doc}
              target="_blank"
              className="text-blue-600 underline mt-1 inline-block"
            >
              View Document
            </a>
          ) : (
            <div className="text-gray-500 mt-1">No document uploaded</div>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-10 flex flex-col md:flex-row gap-5">

        <button
          onClick={() => alert("Approve Clicked")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
        >
          Approve Company
        </button>

        <div className="flex flex-col w-full md:w-auto">
          <textarea
            placeholder="Enter rejection reason..."
            className="border rounded-xl px-3 py-2 mb-3 w-full"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <button
            onClick={() => alert("Reject Clicked")}
            className="bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
          >
            Reject Company
          </button>
        </div>

      </div>
    </div>
  );
}
