import { useEffect, useState } from "react";
import { getMyResumes, uploadResume, applyToJob } from "../../../../apis/jobseeker/apis";
import toast from "react-hot-toast";


export default function ApplyJobModal({ open, onClose, jobId, onApplied }) {
  // const [resumeType, setResumeType] = useState("existing");
  const [resumeType, setResumeType] = useState("existing");
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [file, setFile] = useState(null);
  const [saveToProfile, setSaveToProfile] = useState(true);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [coverLetter, setCoverLetter] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [currentRole, setCurrentRole] = useState("");





  useEffect(() => {
    if (open) fetchResumes();

    if (!open) {
    setCurrentSalary("");
    setSaveToProfile(true);
    setExpectedSalary("");
    setNoticePeriod("");
      setCoverLetter("");
      setError(null);
      setFieldErrors({});
      setFile(null);
      setLoading(false);
setPhone("");
setLocation("");
setExperience("");
setCurrentRole("");

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

const isValidPhone = (value) => {
  const cleaned = value.replace(/\s+/g, "");
  return /^[0-9+]{10,15}$/.test(cleaned);
};


const handleApply = async () => {
  try {
    setError(null);
    setFieldErrors({});
    setLoading(true);

    // ---------- SALARY VALIDATION ----------
    if (!expectedSalary) {
      setError("Expected salary is required.");
      return;
    }

if (!phone) {
  setError("Phone number is required.");
  return;
}

if (!isValidPhone(phone)) {
  setError("Please enter a valid phone number.");
  return;
}

if (!location || location.length < 2) {
  setError("Location is required.");
  return;
}


if (Number(experience) < 0) {
  setError("Experience cannot be negative.");
  return;
}


    if (Number(expectedSalary) <= 0) {
      setError("Expected salary must be greater than zero.");
      return;
    }

    // ---------- COVER LETTER VALIDATION ----------
    if (isCoverLetterUnsafe(coverLetter)) {
      setError("Cover letter contains unsafe content.");
      return;
    }

let payload = {
  jobId,
  phone,
  location,
  experience: experience === "" ? null : Number(experience),
  currentRole,
  coverLetter: coverLetter || "",
  currentSalary: currentSalary ? Number(currentSalary) : null,
  expectedSalary: Number(expectedSalary),
  noticePeriod: noticePeriod || "",
};

    // ---------- RESUME LOGIC ----------
    if (resumeType === "existing") {
      if (!selectedResume) {
        setError("Please select a resume.");
        return;
      }

      payload.resumeId = selectedResume.id;
    }

    if (resumeType === "upload") {
      if (!file) {
        setError("Please upload a resume.");
        return;
      }

      // save to profile only if user wants
      if (saveToProfile) {
        await uploadResume(file);
      }

      payload.file = file;
    }

    // ---------- APPLY ----------
    await applyToJob(payload);

    toast.success("Applied successfully 🎉");
    onApplied?.();
    onClose();
  } catch (err) {
    console.error("Apply failed", err);

    const parsed = parseApiError(err);
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

if (!open) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Apply for this job
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="px-6 py-6 space-y-6 max-h-[75vh] overflow-y-auto">

        {/* RESUME SECTION */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Resume <span className="text-red-500">*</span>
          </h3>

          {/* EXISTING RESUME */}
          <label className="flex gap-3 p-4 border rounded-xl cursor-pointer hover:border-blue-400 transition">
            <input
              type="radio"
              checked={resumeType === "existing"}
              onChange={() => setResumeType("existing")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-slate-900">Use existing resume</p>
              <p className="text-sm text-slate-500">
                Select from resumes already uploaded
              </p>

              {resumeType === "existing" && (
                <div className="mt-3 space-y-2">
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
                        checked={selectedResume?.id === r.id}
                        onChange={() => setSelectedResume(r)}
                      />
                      {r.title}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </label>

          {/* UPLOAD RESUME */}
          <label className="flex gap-3 p-4 border rounded-xl cursor-pointer hover:border-blue-400 transition">
            <input
              type="radio"
              checked={resumeType === "upload"}
              onChange={() => setResumeType("upload")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-slate-900">Upload new resume</p>
              <p className="text-sm text-slate-500">
                PDF, DOC or DOCX format
              </p>

              {resumeType === "upload" && (
                <div className="mt-3 space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                  />

                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={saveToProfile}
                      onChange={(e) => setSaveToProfile(e.target.checked)}
                    />
                    Save this resume to my profile
                  </label>
                </div>
              )}
            </div>
          </label>

          {fieldErrors?.resume && (
            <p className="text-sm text-red-600">
              {fieldErrors.resume[0]}
            </p>
          )}
        </div>

        {/* COVER LETTER */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Cover letter <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            rows={5}
            value={coverLetter}
            disabled={loading}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Explain why you're a good fit for this role..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>
              {coverLetter.length > 0 && `${coverLetter.length} characters`}
            </span>
            <span>Optional</span>
          </div>
        </div>

{/* CANDIDATE DETAILS */}
<div className="space-y-4">
  <h3 className="text-sm font-semibold text-slate-900">
    Candidate Details
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    {/* PHONE */}
    <div>
      <label className="text-sm font-medium text-slate-700">
        Phone Number
      </label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="e.g +91 98765 43210"
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    {/* LOCATION */}
    <div>
      <label className="text-sm font-medium text-slate-700">
        Current Location
      </label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g. Kochi, Kerala"
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    {/* EXPERIENCE */}
    <div>
      <label className="text-sm font-medium text-slate-700">
        Total Experience (years)
      </label>
      <input
        type="number"
        min="0"
        step="0.5"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="e.g. 2.5"
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    {/* CURRENT ROLE */}
    <div>
      <label className="text-sm font-medium text-slate-700">
        Current Role
      </label>
      <input
        type="text"
        value={currentRole}
        onChange={(e) => setCurrentRole(e.target.value)}
        placeholder="e.g. Junior Python Developer"
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

  </div>
</div>


        {/* SALARY & NOTICE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Current Salary in LPA (optional)
            </label>
            <input
              type="number"
              value={currentSalary}
              placeholder="e.g. 600000"
              onChange={(e) => setCurrentSalary(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Expected Salary in LPA <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 600000"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
            {fieldErrors?.expected_salary && (
              <p className="text-sm text-red-600">
                {fieldErrors.expected_salary[0]}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Notice Period (optional)
            </label>
            <input
              type="text"
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
              placeholder="e.g. 30 days / Immediate"
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  </div>
);

}
