import React, { useEffect, useState } from "react";
import { Upload, Trash2, Download, Edit2, Check, AlertCircle } from "lucide-react";
import api from "../../apis/api";

export default function ResumeUploadCard() {
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  console.log(resumes)

  // ------------------------------------
  // Fetch resumes on load
  // ------------------------------------
  useEffect(() => {
    api
      .get("/v1/profile/me/resumes/")
      .then((res) => setResumes(res.data || []))
      .catch(() => setResumes([]));
  }, []);

  // Auto hide alerts
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  // ------------------------------------
  // Upload resume
  // ------------------------------------
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // VALIDATIONS
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/rtf",
    ];

    if (!allowed.includes(file.type)) {
      setError("Only PDF, DOC, DOCX, RTF files allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File must be less than 2 MB.");
      return;
    }

    setUploading(true);

    // Generate title from filename (remove extension)
    const originalName = file.name;
    const title = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await api.post("/v1/profile/me/resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResumes((prev) => [...prev, res.data]); // DRF returns resume object
      setSuccess("Resume uploaded successfully!");
    } catch (err) {
      console.log(err);
      setError("Failed to upload resume.");
    }

    setUploading(false);
  };

  // ------------------------------------
  // Delete resume
  // ------------------------------------
  const handleDelete = async (id) => {
    try {
      await api.delete(`/v1/profile/me/resumes/${id}/`);
      setResumes((prev) => prev.filter((item) => item.id !== id));
      setSuccess("Resume deleted!");
    } catch {
      setError("Failed to delete resume.");
    }
  };

  const downloadResume = (url, title) => {
    const link = document.createElement("a");
    link.href = "https://res.cloudinary.com/dycb8cbf8/"+url;
    link.download = `${title}`;
    link.target = "_blank"; 
    document.body.appendChild(link);
    link.click();
    link.remove();
  };


  return (
    <div className="border rounded-2xl bg-white shadow-sm p-6 mt-8">

      <h2 className="text-lg font-semibold mb-4">Resume</h2>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-100 text-green-700 border border-green-300 px-3 py-2 rounded mb-3 flex items-center gap-2">
          ✓ {success}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded mb-3 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* LIST OF UPLOADED RESUMES */}
      {resumes.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border mb-4"
        >
          <div>
            <p className="font-medium text-gray-800">{file.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              Uploaded on {new Date(file.uploaded_at).toDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Edit2 className="w-4 h-4 text-gray-600 cursor-pointer" />
            <Check className="w-4 h-4 text-blue-600" />
            <Download className="w-5 h-5 text-gray-600 cursor-pointer" />
            <Trash2
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() => handleDelete(file.id)}
            />
          </div>
        </div>
      ))}

      {/* ADD BUTTON */}
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
  );
}
