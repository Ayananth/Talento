import { useEffect, useState } from "react";
import { getMyResumes, uploadResume } from "../../../../apis/jobseeker/apis";

export default function ApplyJobModal({ open, onClose, jobId }) {
  const [resumeType, setResumeType] = useState("existing");
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchResumes();
  }, [open]);

  const fetchResumes = async () => {
    try {
      const res = await getMyResumes();
      setResumes(res);
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    }
  };

  const handleApply = async () => {
    try {
      setLoading(true);

      let resumeId = selectedResumeId;

      // Upload new resume if selected
      if (resumeType === "upload" && file) {
        const uploaded = await uploadResume(file);
        resumeId = uploaded.id;
      }

      if (!resumeId) {
        alert("Please select or upload a resume");
        return;
      }


      console.log("Applying job:", {
        jobId,
        resumeId,
      });

      onClose();
    } catch (err) {
      console.error("Apply failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">

        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Apply for this job
        </h2>

        <div className="space-y-6">

          {/* EXISTING RESUME */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={resumeType === "existing"}
                onChange={() => setResumeType("existing")}
              />
              <span className="font-medium">Select existing resume</span>
            </label>

            {resumeType === "existing" && (
              <div className="ml-6 mt-3 space-y-2">
                {resumes.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No resumes uploaded yet
                  </p>
                )}

                {resumes.map((r) => (
                  <label
                    key={r.id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="resume"
                      checked={selectedResumeId === r.id}
                      onChange={() => setSelectedResumeId(r.id)}
                    />
                    {r.file}
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
                checked={resumeType === "upload"}
                onChange={() => setResumeType("upload")}
              />
              <span className="font-medium">Upload new resume</span>
            </label>

            {resumeType === "upload" && (
              <div className="ml-6 mt-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
