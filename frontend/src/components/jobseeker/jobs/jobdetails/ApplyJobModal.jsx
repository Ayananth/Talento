import { useState } from "react";

export default function ApplyJobModal({ open, onClose }) {
  if (!open) return null;

  const [resumeType, setResumeType] = useState("existing");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Apply for this job
        </h2>

        {/* BODY */}
        <div className="space-y-6">

          {/* EXISTING RESUME */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="resumeType"
                checked={resumeType === "existing"}
                onChange={() => setResumeType("existing")}
              />
              <span className="font-medium text-slate-700">
                Select existing resume
              </span>
            </label>

            {resumeType === "existing" && (
              <div className="ml-6 mt-3 space-y-2">
                {["resume_jan_2024.pdf", "resume_backend.pdf"].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                  >
                    <input type="radio" name="resume" />
                    {r}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* UPLOAD RESUME */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="resumeType"
                checked={resumeType === "upload"}
                onChange={() => setResumeType("upload")}
              />
              <span className="font-medium text-slate-700">
                Upload new resume
              </span>
            </label>

            {resumeType === "upload" && (
              <div className="ml-6 mt-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-slate-600"
                />
                <p className="text-xs text-slate-500 mt-1">
                  PDF, DOC, DOCX supported
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
