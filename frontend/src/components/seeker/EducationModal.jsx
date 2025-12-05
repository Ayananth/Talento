import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EducationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null, // If editing, contains: {id, degree, institution, start_date, end_date}
}) {
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setDegree(initialData.degree || "");
      setInstitution(initialData.institution || "");
      setStartDate(initialData.start_date || "");
      setEndDate(initialData.end_date || "");
    } else {
      setDegree("");
      setInstitution("");
      setStartDate("");
      setEndDate("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      degree,
      institution,
      start_date: startDate,
      end_date: endDate || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
        
        {/* Close Button */}
        <button className="absolute right-4 top-4" onClick={onClose}>
          <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Education" : "Add Education"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Degree */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Degree
            </label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institution
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              {initialData ? "Save Changes" : "Add"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
