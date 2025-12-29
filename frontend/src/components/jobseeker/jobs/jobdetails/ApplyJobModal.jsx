import { useEffect, useState } from "react";
import { getMyResumes, uploadResume, applyToJob } from "../../../../apis/jobseeker/apis";
import toast from "react-hot-toast";


export default function ApplyJobModal({ open, onClose, jobId, onApplied }) {
  // const [resumeType, setResumeType] = useState("existing");
  const [resumeType] = useState("upload");


  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [coverLetter, setCoverLetter] = useState("");



  useEffect(() => {
    if (open) fetchResumes();

    if (!open) {
      setCoverLetter("");
      setError(null);
      setFieldErrors({});
      setFile(null);
      setLoading(false);
    }

    

  }, [open]);


  const DANGEROUS_REGEX =
    /(<script|<\/script>|<.*?>|javascript:|onerror=|onload=)/i;

  const isCoverLetterUnsafe = (text) => {
    return DANGEROUS_REGEX.test(text);
  };


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
    setError(null);
    setFieldErrors({});
    setLoading(true);

    if (!file) {
      setError("Please upload a resume to apply.");
      return;
    }

    if (isCoverLetterUnsafe(coverLetter)) {
      setError(
        "Cover letter contains unsupported or unsafe content."
      );
      return;
    }

    await applyToJob({
      jobId,
      file,
      coverLetter,
    });
    toast.dismiss();
    toast.success("Applied successfully ");
    onApplied?.();

    onClose();
  } catch (err) {
    const parsed = parseApiError(err);
    console.log("parsed: ", parsed)

    setError(parsed.message);
    setFieldErrors(parsed.fields || {});
  } finally {
    setLoading(false);
  }
};





  if (!open) return null;


const parseApiError = (err) => {
  // Network error
  if (!err.response) {
    return {
      message: "Network error. Please check your connection.",
      fields: {},
    };
  }

  const data = err.response.data;

  // DRF detail error
  if (typeof data?.detail === "string") {
    return {
      message: data.detail,
      fields: {},
    };
  }

  // DRF field errors (like job, resume, etc.)
  if (typeof data === "object") {
    const messages = [];

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((msg) => messages.push(msg));
      }
    });

    return {
      message: messages.join(" "),
      fields: data,
    };
  }

  return {
    message: "Something went wrong. Please try again.",
    fields: {},
  };
};



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
                  disabled={loading}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cover letter (optional)
            </label>

            <textarea
              rows={5}
              value={coverLetter}
              disabled={loading}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you're a good fit for this role..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>
                {coverLetter.length > 0 && `${coverLetter.length} characters`}
              </span>
              <span>Optional</span>
            </div>

            {fieldErrors?.cover_letter && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.cover_letter[0]}
              </p>
            )}
          </div>

        </div>

        {fieldErrors?.resume && (
          <p className="mt-2 text-sm text-red-600">
            {fieldErrors.resume[0]}
          </p>
        )}


        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}


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
