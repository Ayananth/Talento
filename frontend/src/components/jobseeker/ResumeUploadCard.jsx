import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Download,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import api from "../../apis/api";

const POLL_INTERVAL_MS = 5000;

const EMPTY_REVIEW_FORM = {
  role: "",
  skills: "",
  education: "",
  projects_summary: "",
  experience_summary: "",
};

const toText = (value) => (value == null ? "" : String(value).trim());

const toSkillsText = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((item) => toText(item)).filter(Boolean).join(", ");
  }
  return toText(skills);
};

const mapParsedDataToForm = (parsedData) => ({
  role: toText(parsedData?.role),
  skills: toSkillsText(parsedData?.skills),
  education: toText(parsedData?.education),
  projects_summary: toText(parsedData?.projects_summary),
  experience_summary: toText(parsedData?.experience_summary),
});

const normalizeConfirmPayload = (form) => ({
  role: toText(form.role),
  skills: toSkillsText(form.skills)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean),
  education: toText(form.education),
  projects_summary: toText(form.projects_summary),
  experience_summary: toText(form.experience_summary),
});

const getStatusPillClasses = (status) => {
  switch (status) {
    case "PARSING":
      return "bg-blue-100 text-blue-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "PARSED":
      return "bg-amber-100 text-amber-700";
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ResumeUploadCard() {
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [reviewWarning, setReviewWarning] = useState("");
  const [reviewResumeId, setReviewResumeId] = useState(null);
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW_FORM);
  const [confirming, setConfirming] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");

  const pollingIntervalRef = useRef(null);
  const pollingResumeIdRef = useRef(null);
  const openedTerminalModalRef = useRef(new Set());

  const defaultResume = useMemo(
    () => resumes.find((resume) => resume.is_default),
    [resumes]
  );
  const reviewResume = useMemo(
    () => resumes.find((resume) => resume.id === reviewResumeId),
    [resumes, reviewResumeId]
  );
  const hasResumes = resumes.length > 0;
  const isAlreadyConfirmed = reviewResume?.status === "CONFIRMED";

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    pollingResumeIdRef.current = null;
  };

  const upsertResume = (updatedResume) => {
    if (!updatedResume || !updatedResume.id) return;

    setResumes((prev) => {
      const exists = prev.some((resume) => resume.id === updatedResume.id);
      let next = exists
        ? prev.map((resume) =>
            resume.id === updatedResume.id ? { ...resume, ...updatedResume } : resume
          )
        : [updatedResume, ...prev];

      if (updatedResume.is_default) {
        next = next.map((resume) => ({
          ...resume,
          is_default: resume.id === updatedResume.id,
        }));
      }

      return next;
    });
  };

  const openReviewPanelForResume = (resume) => {
    if (!resume?.is_default) return;
    if (!["PARSED", "FAILED", "CONFIRMED"].includes(resume.status)) return;

    const modalKey = `${resume.id}:${resume.status}`;
    if (openedTerminalModalRef.current.has(modalKey)) return;
    openedTerminalModalRef.current.add(modalKey);

    setReviewResumeId(resume.id);

    if (resume.status === "FAILED") {
      setReviewWarning("Automatic parsing failed. Please fill in details manually.");
      setReviewForm(EMPTY_REVIEW_FORM);
    } else {
      setReviewWarning("");
      setReviewForm(mapParsedDataToForm(resume.parsed_data || {}));
    }

    setIsReviewPanelOpen(true);
  };

  const pollResumeStatus = async (resumeId) => {
    try {
      const { data } = await api.get(`/v1/profile/me/resumes/${resumeId}/`);
      const resolvedResume = Array.isArray(data)
        ? data.find((item) => Number(item?.id) === Number(resumeId))
        : data;

      if (!resolvedResume?.id) {
        setError("Unexpected resume status response from server.");
        stopPolling();
        return;
      }

      upsertResume(resolvedResume);

      if (
        !resolvedResume?.is_default ||
        ["PARSED", "FAILED"].includes(resolvedResume?.status)
      ) {
        stopPolling();
      }
    } catch (err) {
      console.error("pollResumeStatus failed", err);
      setError("Failed to fetch parsing status.");
    }
  };

  const startPolling = (resumeId) => {
    if (!resumeId) return;
    if (pollingResumeIdRef.current === resumeId && pollingIntervalRef.current) return;

    stopPolling();
    pollingResumeIdRef.current = resumeId;

    pollResumeStatus(resumeId);

    pollingIntervalRef.current = setInterval(() => {
      pollResumeStatus(resumeId);
    }, POLL_INTERVAL_MS);
  };

  const fetchResumes = async () => {
    try {
      const res = await api.get("/v1/profile/me/resumes/");
      setResumes(res.data || []);
    } catch (err) {
      console.error("fetchResumes failed", err);
      setResumes([]);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timeoutId = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2500);
      return () => clearTimeout(timeoutId);
    }
  }, [error, success]);

  useEffect(() => {
    if (!saveNotice) return;
    const timeoutId = setTimeout(() => {
      setSaveNotice("");
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [saveNotice]);

  useEffect(() => {
    if (!defaultResume) {
      stopPolling();
      return;
    }

    if (defaultResume.status === "PARSING") {
      startPolling(defaultResume.id);
      return;
    }

    if (pollingResumeIdRef.current && pollingResumeIdRef.current !== defaultResume.id) {
      stopPolling();
    }

    if (["PARSED", "FAILED", "CONFIRMED"].includes(defaultResume.status)) {
      openReviewPanelForResume(defaultResume);
    }

    if (pollingResumeIdRef.current === defaultResume.id) {
      stopPolling();
    }
  }, [defaultResume]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const handleReviewFormChange = (field, value) => {
    setSaveNotice("");
    setReviewForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const closeReviewPanel = () => {
    setIsReviewPanelOpen(false);
    setReviewWarning("");
    setReviewResumeId(null);
    setReviewForm(EMPTY_REVIEW_FORM);
    setConfirming(false);
    setSaveNotice("");
  };

  const handleConfirmParsedResume = async () => {
    if (!reviewResumeId) return;
    const wasAlreadyConfirmed = isAlreadyConfirmed;
    setConfirming(true);

    try {
      const payload = normalizeConfirmPayload(reviewForm);
      const { data } = await api.patch(
        `/v1/profile/me/resumes/${reviewResumeId}/confirm/`,
        payload
      );
      const updatedResume = data?.id
        ? data
        : {
            id: reviewResumeId,
            status: "CONFIRMED",
            parsed_data: payload,
          };

      upsertResume(updatedResume);
      setReviewForm(mapParsedDataToForm(updatedResume.parsed_data || payload));

      setConfirming(false);
      setSuccess("Resume confirmed successfully!");
      setIsReviewPanelOpen(true);
      setReviewWarning("");
      setSaveNotice(
        wasAlreadyConfirmed
          ? "Changes updated successfully."
          : "Details confirmed successfully."
      );
    } catch (err) {
      console.error("confirm failed", err);
      setError("Failed to confirm parsed details.");
      setConfirming(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/rtf",
    ];

    if (!allowed.includes(file.type)) {
      setError("Only PDF, DOC, DOCX, RTF files allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File must be less than 2 MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    const originalName = file.name;
    const title =
      originalName.substring(0, originalName.lastIndexOf(".")) || originalName;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await api.post("/v1/profile/me/resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      upsertResume(res.data);
      setSuccess("Resume uploaded successfully!");
    } catch (err) {
      console.error("upload failed", err);
      setError("Failed to upload resume.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      await api.delete(`/v1/profile/me/resumes/${resumeId}/`);

      if (pollingResumeIdRef.current === resumeId) {
        stopPolling();
      }
      if (reviewResumeId === resumeId) {
        closeReviewPanel();
      }

      await fetchResumes();
      setSuccess("Resume deleted!");
    } catch (err) {
      console.error("delete failed", err);
      setError("Failed to delete resume.");
    }
  };

  const downloadResume = (fileValue, title) => {
    const source = typeof fileValue === "string" ? fileValue : fileValue?.url;
    if (!source) {
      setError("Resume file URL is missing.");
      return;
    }

    const href = source.startsWith("http")
      ? source
      : `https://res.cloudinary.com/dycb8cbf8/${source}`;

    const link = document.createElement("a");
    link.href = href;
    link.download = title || "resume";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSetDefault = async (resumeId) => {
    try {
      await api.post(`/v1/profile/me/resumes/${resumeId}/set-default/`);
      await fetchResumes();
      setSuccess("Default resume updated!");
    } catch (err) {
      console.error("set-default failed", err);
      setError("Failed to set default resume.");
    }
  };

  const renderStatusBadge = (resume) => {
    if (!resume.is_default) return null;

    if (resume.status === "PARSING") {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
          <Loader2 className="w-3 h-3 animate-spin" />
          Parsing...
        </span>
      );
    }

    if (resume.status === "FAILED") {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
          Parsing Failed
        </span>
      );
    }

    if (resume.status === "PARSED") {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
          Parsed
        </span>
      );
    }

    if (resume.status === "CONFIRMED") {
      return (
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
          Confirmed
        </span>
      );
    }

    return null;
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-8 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-5 border-b border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Resume</h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload and manage resumes. AI parsing runs only on your default resume.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {resumes.length} {resumes.length === 1 ? "file" : "files"}
            </span>
          </div>
        </div>

        <div className="p-6">
          {success && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg mb-4 flex items-center gap-2">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-900 truncate">{resume.title}</p>
                    {resume.is_default && (
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                        Default
                      </span>
                    )}
                    {resume.is_default && renderStatusBadge(resume)}
                    {!resume.is_default && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusPillClasses(resume.status)}`}
                      >
                        {resume.status || "UPLOADED"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Uploaded on{" "}
                    {resume.uploaded_at
                      ? new Date(resume.uploaded_at).toDateString()
                      : "-"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!resume.is_default && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      title="Set as default"
                      onClick={() => handleSetDefault(resume.id)}
                    >
                      <Check className="h-3.5 w-3.5 text-blue-600" />
                      Default
                    </button>
                  )}

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-100"
                    title="Download"
                    onClick={() => downloadResume(resume.file, resume.title)}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white p-2 text-red-500 hover:bg-red-50"
                    title="Delete"
                    onClick={() => handleDelete(resume.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!hasResumes && (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-700">No resumes uploaded yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Add your first resume to start AI parsing.
              </p>
            </div>
          )}

          <div className="mt-6 border border-dashed border-slate-300 rounded-xl p-8 text-center bg-gradient-to-b from-white to-slate-50">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <label
              htmlFor="resumeInput"
              className="px-6 py-2 border border-blue-200 rounded-full text-blue-700 font-medium hover:bg-blue-50 transition cursor-pointer inline-block"
            >
              {uploading ? "Uploading..." : "Add Resume"}
            </label>

            <input
              id="resumeInput"
              type="file"
              accept=".pdf,.doc,.docx,.rtf"
              className="hidden"
              onChange={handleResumeUpload}
            />

            <p className="text-sm text-slate-500 mt-2">
              Supported Formats: doc, docx, rtf, pdf, upto 2 MB
            </p>
          </div>
        </div>
      </div>

      {isReviewPanelOpen && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-900">Parsed Details</h3>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Please review the parsed details from your resume. Keep this section updated with your latest information to get the best job matches and recommendations. You can edit any field before confirming.
            </p>
            {reviewWarning && (
              <div className="mt-4 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-2 rounded-lg">
                {reviewWarning}
              </div>
            )}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewForm.role}
                  onChange={(e) => handleReviewFormChange("role", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewForm.skills}
                  onChange={(e) => handleReviewFormChange("skills", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900">Education</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Education
              </label>
              <textarea
                rows={5}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reviewForm.education}
                onChange={(e) => handleReviewFormChange("education", e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900">Employment & Projects</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Experience Summary
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewForm.experience_summary}
                  onChange={(e) =>
                    handleReviewFormChange("experience_summary", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Projects Summary
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewForm.projects_summary}
                  onChange={(e) =>
                    handleReviewFormChange("projects_summary", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center min-w-28 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              onClick={handleConfirmParsedResume}
              disabled={confirming}
            >
              {confirming
                ? isAlreadyConfirmed
                  ? "Updating..."
                  : "Confirming..."
                : isAlreadyConfirmed
                  ? "Update"
                  : "Confirm"}
            </button>
          </div>
          {saveNotice && (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {saveNotice}
            </div>
          )}
        </div>
      )}
    </>
  );
}
