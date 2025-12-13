import React, { useEffect, useState } from "react";
import FirstTimeCompanyView from "./FirstTimeCompanyView";
import SideComparison from "./SideComparison";
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
  const [data, setData] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  /**
   * SAMPLE DATA replacing API calls
   */
  const SAMPLE_DATA = {
    user: { email: "hr@technova.com" },
    status: "pending",
    submission_type: "edit",

    published_data: {
      company_name: "TechNova",
      website: "https://technova.com",
      industry: "Software Development",
      company_size: "51-200",
      logo: "https://via.placeholder.com/120?text=Old+Logo",
      about_company: "We are a software company building web tools.",
      phone: "+91 9876543210",
      support_email: "support@technova.com",
      location: "Bangalore",
      address: "HSR Layout",
      linkedin: "https://linkedin.com/company/technova",
      business_registration_doc:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },

    pending_data: {
      company_name: "TechNova Innovations",
      industry: "AI & Software",
      phone: "+91 9999999999",
      location: "Bangalore, India",
      about_company: "Updated description with AI projects.",
    },

    draft_logo: "https://via.placeholder.com/120?text=New+Logo",
    draft_business_registration_doc:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  };

  useEffect(() => {
    // Simulate fetching data (no API calls)
    setTimeout(() => {
      setData(SAMPLE_DATA);
    }, 500);
  }, []);

  if (!data) return <div className="p-10 text-center">Loading sample data...</div>;

  const {
    published_data,
    pending_data,
    status,
    submission_type,
    draft_logo,
    draft_business_registration_doc,
    user,
  } = data;

  // return <SideComparison/>

  // return <FirstTimeCompanyView data={data}/>

  return (
    
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8 p-6 rounded-xl shadow bg-white border">
        <h1 className="text-3xl font-bold mb-2">
          {pending_data.company_name || published_data.company_name}
        </h1>

        <p className="text-gray-700">
          Recruiter: <span className="font-semibold">{user.email}</span>
        </p>

        <p className="text-gray-700 mt-1">
          Status:{" "}
          <span className="px-3 py-1 bg-yellow-200 rounded-lg font-medium">
            {status}
          </span>
        </p>

        <p className="text-gray-700 mt-1">
          Submission Type:{" "}
          <span className="font-semibold">
            {submission_type === "first" ? "First-Time Registration" : "Edit Request"}
          </span>
        </p>
      </div>

      {/* Comparison Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LIVE DATA */}
        <div className="border rounded-xl p-6 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Current Published Data
          </h2>

          {Object.entries(published_data).map(([field, value]) => (
            <div key={field} className="mb-4">
              <div className="font-semibold text-gray-700 capitalize">
                {field.replace(/_/g, " ")}:
              </div>
              <div className="text-gray-900">{value || "—"}</div>
            </div>
          ))}

          {/* Published Logo */}
          <div className="mb-4">
            <div className="font-semibold text-gray-700">Logo:</div>
            {published_data.logo ? (
              <img
                src={published_data.logo}
                alt="logo"
                className="h-24 mt-2 rounded"
              />
            ) : (
              <div className="text-gray-500">—</div>
            )}
          </div>

          {/* Published Doc */}
          <div className="mb-4">
            <div className="font-semibold text-gray-700">Business Document:</div>
            {published_data.business_registration_doc ? (
              <a
                href={published_data.business_registration_doc}
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
          <h2 className="text-xl font-bold mb-4 text-gray-800">
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
              <div className="font-semibold text-gray-700 capitalize">
                {field.replace(/_/g, " ")}:
              </div>
              <div className="text-gray-900">{value || "—"}</div>
            </div>
          ))}

          {/* Pending Logo */}
          <div
            className={`mb-4 p-2 rounded ${
              draft_logo ? "bg-yellow-100" : ""
            }`}
          >
            <div className="font-semibold text-gray-700">Logo (New):</div>
            {draft_logo ? (
              <img
                src={draft_logo}
                alt="pending logo"
                className="h-24 mt-2 rounded"
              />
            ) : (
              <div className="text-gray-500">—</div>
            )}
          </div>

          {/* Pending Doc */}
          <div
            className={`mb-4 p-2 rounded ${
              draft_business_registration_doc ? "bg-yellow-100" : ""
            }`}
          >
            <div className="font-semibold text-gray-700">
              Business Document (New):
            </div>
            {draft_business_registration_doc ? (
              <a
                href={draft_business_registration_doc}
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

      {/* Dummy Approve & Reject Buttons */}
      <div className="mt-10 flex flex-col md:flex-row gap-4 justify-between">

        <button
          onClick={() => alert("Approve Clicked")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
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
            onClick={() => alert("Reject Clicked")}
            className="bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
          >
            Reject Changes
          </button>
        </div>
      </div>
    </div>
  );
}
