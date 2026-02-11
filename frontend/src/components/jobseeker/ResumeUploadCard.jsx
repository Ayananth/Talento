import React, { useEffect, useMemo, useState } from "react";
import { Trash2, Download, Check, AlertCircle, X } from "lucide-react";
import api from "../../apis/api";
import {
  mockConfirmParsedResume,
  mockParseResume,
} from "../../apis/jobseeker/mockResumeApi";

const allowedFileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/rtf",
];

const initialParsedForm = {
  skills: "",
  education_details: "",
  employment_details: "",
  projects_summary: "",
};

export default function ResumeUploadCard() {
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [parsing, setParsing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [parsedForm, setParsedForm] = useState(initialParsedForm);

  const fetchResumes = () => {
    api
      .get("/v1/profile/me/resumes/")
      .then((res) => setResumes(res.data || []))
      .catch(() => setResumes([]));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  const resetUploadFlow = () => {
    setShowUploadModal(false);
    setShowReviewModal(false);
    setSelectedFile(null);
    setParsing(false);
    setConfirming(false);
    setParsedForm(initialParsedForm);
  };

  const validateFile = (file) => {
    if (!file) {
      setError("Please choose a resume file.");
      return false;
    }

    if (!allowedFileTypes.includes(file.type)) {
      setError("Only PDF, DOC, DOCX, RTF files allowed.");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File must be less than 2 MB.");
      return false;
    }

    return true;
  };

  const handleParseResume = async () => {
    if (!validateFile(selectedFile)) return;

    setParsing(true);

    try {
      const parsedData = await mockParseResume(selectedFile);
      setParsedForm(parsedData);
      setShowUploadModal(false);
      setShowReviewModal(true);
    } catch (err) {
      setError("Failed to parse resume. Please try again.");
    }

    setParsing(false);
  };

  const handleConfirmParsedData = async () => {
    if (!selectedFile) {
      setError("No resume selected.");
      return;
    }

    setConfirming(true);

    try {
      const confirmedResume = await mockConfirmParsedResume({
        file: selectedFile,
        details: parsedForm,
      });

      setResumes((prev) => [confirmedResume, ...prev]);
      setSuccess("Resume parsed and confirmed successfully!");
      resetUploadFlow();
    } catch (err) {
      setError("Failed to confirm resume details.");
    }

    setConfirming(false);
  };

  const handleDelete = async (resume) => {
    if (resume.file_url) {
      setResumes((prev) => prev.filter((item) => item.id !== resume.id));
      setSuccess("Resume deleted!");
      return;
    }

    try {
      await api.delete(`/v1/profile/me/resumes/${resume.id}/`);
      fetchResumes();
      setSuccess("Resume deleted!");
    } catch {
      setError("Failed to delete resume.");
    }
  };

  const handleSetDefault = async (resume) => {
    if (resume.file_url) {
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          is_default: r.id === resume.id,
        }))
      );
      setSuccess("Default resume updated!");
      return;
    }

    try {
      await api.post(`/v1/profile/me/resumes/${resume.id}/set-default/`);
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          is_default: r.id === resume.id,
        }))
      );
      setSuccess("Default resume updated!");
    } catch (err) {
      setError("Failed to set default resume.");
    }
  };

  const downloadInfo = useMemo(
    () =>
      resumes.reduce((acc, resume) => {
        if (resume.file_url) {
          acc[resume.id] = resume.file_url;
        } else if (resume.file) {
          acc[resume.id] = `https://res.cloudinary.com/dycb8cbf8/${resume.file}`;
        }
        return acc;
      }, {}),
    [resumes]
  );

  const downloadResume = (resume) => {
    const url = downloadInfo[resume.id];
    if (!url) {
      setError("No downloadable file found for this resume.");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = resume.title || "resume";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="border rounded-2xl bg-white shadow-sm p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4">Resume</h2>

      {success && (
        <div className="bg-green-100 text-green-700 border border-green-300 px-3 py-2 rounded mb-3 flex items-center gap-2">
          {success}
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
              Uploaded on {new Date(resume.uploaded_at).toDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!resume.is_default && (
              <Check
                className="w-4 h-4 text-blue-600 cursor-pointer hover:scale-110 transition"
                title="Set as default"
                onClick={() => handleSetDefault(resume)}
              />
            )}
            {resume.is_default && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Default
              </span>
            )}

            <Download
              className="w-5 h-5 text-gray-600 cursor-pointer"
              onClick={() => downloadResume(resume)}
            />
            <Trash2
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() => handleDelete(resume)}
            />
          </div>
        </div>
      ))}

      <div className="mt-6 border border-dashed rounded-xl p-8 text-center">
        <button
          type="button"
          className="px-6 py-2 border rounded-full text-blue-600 hover:bg-blue-50 transition cursor-pointer inline-block"
          onClick={() => {
            setSelectedFile(null);
            setParsedForm(initialParsedForm);
            setShowUploadModal(true);
          }}
        >
          Add Resume
        </button>

        <p className="text-sm text-gray-500 mt-2">
          Supported Formats: doc, docx, rtf, pdf, upto 2 MB
        </p>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            <button
              className="absolute right-4 top-4 text-gray-600"
              onClick={resetUploadFlow}
              disabled={parsing}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose a resume. We will parse and pre-fill your profile details.
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.rtf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full border rounded-lg p-2"
              disabled={parsing}
            />

            {selectedFile && (
              <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border rounded-lg text-gray-700"
                onClick={resetUploadFlow}
                disabled={parsing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                onClick={handleParseResume}
                disabled={parsing}
              >
                {parsing ? "Processing..." : "Submit Resume"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute right-4 top-4 text-gray-600"
              onClick={resetUploadFlow}
              disabled={confirming}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold mb-2">Review Extracted Details</h3>
            <p className="text-sm text-gray-500 mb-5">
              Update any incorrect values, then confirm to save.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={parsedForm.skills}
                  onChange={(e) =>
                    setParsedForm((prev) => ({ ...prev, skills: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Details
                </label>
                <textarea
                  rows={3}
                  className="w-full border rounded-lg p-2"
                  value={parsedForm.education_details}
                  onChange={(e) =>
                    setParsedForm((prev) => ({
                      ...prev,
                      education_details: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Details
                </label>
                <textarea
                  rows={5}
                  className="w-full border rounded-lg p-2"
                  value={parsedForm.employment_details}
                  onChange={(e) =>
                    setParsedForm((prev) => ({
                      ...prev,
                      employment_details: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projects Summary
                </label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg p-2"
                  value={parsedForm.projects_summary}
                  onChange={(e) =>
                    setParsedForm((prev) => ({
                      ...prev,
                      projects_summary: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border rounded-lg text-gray-700"
                onClick={resetUploadFlow}
                disabled={confirming}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                onClick={handleConfirmParsedData}
                disabled={confirming}
              >
                {confirming ? "Saving..." : "Confirm Details"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
