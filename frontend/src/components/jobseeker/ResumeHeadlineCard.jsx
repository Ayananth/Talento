import React from "react";

export default function ResumeHeadlineCard() {
  return (
    <div className="rounded-xl border bg-white px-6 py-4 shadow-sm flex items-start justify-between">
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Resume headline
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Python Backend Developer, 2 years experience
        </p>
      </div>

      <button className="text-blue-600 text-sm font-medium hover:underline">
        Edit
      </button>
    </div>
  );
}
