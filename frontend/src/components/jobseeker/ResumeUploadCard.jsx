import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Download,
  Loader2,
  Trash2,
} from "lucide-react";
import api from "../../apis/api";

const POLL_INTERVAL_MS = 2000;

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
  };

  const handleConfirmParsedResume = async () => {
    if (!reviewResumeId) return;
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
      setReviewForm(
        mapParsedDataToForm(updatedResume.parsed_data || payload)
      );

      setConfirming(false);
      setSuccess("Resume confirmed successfully!");
      setIsReviewPanelOpen(true);
      setReviewWarning("");
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
        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          <Loader2 className="w-3 h-3 animate-spin" />
          Parsing...
        </span>
      );
    }

    if (resume.status === "FAILED") {
      return (
        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
          Parsing Failed
        </span>
      );
    }

    if (resume.status === "PARSED") {
      return (
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
          Parsed
        </span>
      );
    }

    if (resume.status === "CONFIRMED") {
      return (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Confirmed
        </span>
      );
    }

    return null;
  };

  return (
    <>
      <div className="border rounded-2xl bg-white shadow-sm p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Resume</h2>

        {success && (
          <div className="bg-green-100 text-green-700 border border-green-300 px-3 py-2 rounded mb-3 flex items-center gap-2">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded mb-3 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border mb-4"
          >
            <div>
              <p className="font-medium text-gray-800">{resume.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                Uploaded on{" "}
                {resume.uploaded_at
                  ? new Date(resume.uploaded_at).toDateString()
                  : "-"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!resume.is_default && (
                <Check
                  className="w-4 h-4 text-blue-600 cursor-pointer hover:scale-110 transition"
                  title="Set as default"
                  onClick={() => handleSetDefault(resume.id)}
                />
              )}

              {resume.is_default && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Default
                </span>
              )}

              {renderStatusBadge(resume)}

              <Download
                className="w-5 h-5 text-gray-600 cursor-pointer"
                title="Download"
                onClick={() => downloadResume(resume.file, resume.title)}
              />

              <Trash2
                className="w-5 h-5 text-red-500 cursor-pointer"
                title="Delete"
                onClick={() => handleDelete(resume.id)}
              />
            </div>
          </div>
        ))}

        <div className="mt-6 border border-dashed rounded-xl p-8 text-center">
          <label
            htmlFor="resumeInput"
            className="px-6 py-2 border rounded-full text-blue-600 hover:bg-blue-50 transition cursor-pointer inline-block"
          >
            {uploading ? "Uploading..." : "add"}
          </label>

          <input
            id="resumeInput"
            type="file"
            accept=".pdf,.doc,.docx,.rtf"
            className="hidden"
            onChange={handleResumeUpload}
          />

          <p className="text-sm text-gray-500 mt-2">
            Supported Formats: doc, docx, rtf, pdf, upto 2 MB
          </p>
        </div>
      </div>

      {isReviewPanelOpen && (
        <div className="space-y-6">
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900">Role & Skills</h3>
            <p className="text-sm text-gray-500 mt-1">
              Review parsed details and edit if needed.
            </p>
            {reviewWarning && (
              <div className="mt-4 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-2 rounded">
                {reviewWarning}
              </div>
            )}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewForm.role}
                  onChange={(e) => handleReviewFormChange("role", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewForm.skills}
                  onChange={(e) => handleReviewFormChange("skills", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education
              </label>
              <textarea
                rows={5}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reviewForm.education}
                onChange={(e) => handleReviewFormChange("education", e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900">Employment & Projects</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Summary
                </label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewForm.experience_summary}
                  onChange={(e) =>
                    handleReviewFormChange("experience_summary", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projects Summary
                </label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
              onClick={handleConfirmParsedResume}
              disabled={confirming}
            >
              {confirming
                ? (isAlreadyConfirmed ? "Updating..." : "Confirming...")
                : (isAlreadyConfirmed ? "Update" : "Confirm")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
