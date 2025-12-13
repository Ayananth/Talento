import React, { useState, useEffect } from "react";

/**
 * SAMPLE DATA (Replace with API call)
 */
const sampleExisting = {
  company_name: "Talento Tech Pvt Ltd",
  industry: "Software",
  website: "https://talento.com",
  address: "Kochi, Kerala",
  description: "We hire software engineers.",
};

const samplePending = {
  company_name: "Talento Technologies Pvt Ltd",
  industry: "IT Services",
  website: "https://talento.tech",
  address: "Kochi, Kerala",
  description: "We hire top-tier engineers globally.",
};

export default function SideComparison() {
  const [existingData, setExistingData] = useState(null);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setExistingData(sampleExisting);
      setPendingData(samplePending);
    }, 500);
  }, []);

  if (!existingData || !pendingData) {
    return <p className="text-center py-10">Loading...</p>;
  }

  const fields = Object.keys(existingData);

  const isChanged = (key) =>
    existingData[key]?.trim() !== pendingData[key]?.trim();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Recruiter Edit Request Review</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Existing Data */}
        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Current Profile</h2>
          {fields.map((key) => (
            <div key={key} className="mb-4">
              <p className="text-gray-500 text-sm uppercase">{key}</p>
              <p
                className={`p-2 rounded bg-gray-100 ${
                  isChanged(key) ? "border border-red-400" : ""
                }`}
              >
                {existingData[key] || "—"}
              </p>
            </div>
          ))}
        </div>

        {/* Pending Data */}
        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Requested Changes</h2>
          {fields.map((key) => (
            <div key={key} className="mb-4">
              <p className="text-gray-500 text-sm uppercase">{key}</p>
              <p
                className={`p-2 rounded ${
                  isChanged(key) ? "bg-yellow-100 border border-yellow-500" : "bg-gray-100"
                }`}
              >
                {pendingData[key] || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 justify-center">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
          Approve Changes
        </button>

        <button className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700">
          Reject Request
        </button>
      </div>
    </div>
  );
}
