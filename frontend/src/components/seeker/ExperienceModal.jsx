import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import api from "../../apis/api";

export default function ExperienceModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
}) {
  const [form, setForm] = useState({
    role: "",
    company: "",
    employment_type: "",
    start_date: "",
    end_date: "",
    notice_period: "",
    description: "",
    skills: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Load edit data
  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        role: initialData.role ?? "",
        company: initialData.company ?? "",
        employment_type: initialData.employment_type ?? "",
        start_date: initialData.start_date ?? "",
        end_date: initialData.end_date ?? "",
        notice_period: initialData.notice_period ?? "",
        description: initialData.description ?? "",
        skills: initialData.skills ?? "",
      });
    } else if (isOpen) {
      // Reset for Add mode
      setForm({
        role: "",
        company: "",
        employment_type: "",
        start_date: "",
        end_date: "",
        notice_period: "",
        description: "",
        skills: "",
      });
    }
  }, [isOpen, initialData]);

  const validate = () => {
    if (!form.role.trim()) return "Role is required";
    if (!form.company.trim()) return "Company is required";
    if (!form.employment_type.trim()) return "Employment type is required";
    if (!form.start_date) return "Start date is required";
    return "";
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);

    try {
      let response;

      if (initialData) {
        // EDIT
        response = await api.patch(
          `/v1/profile/me/experience/${initialData.id}/`,
          form
        );
      } else {
        // ADD
        response = await api.post(`/v1/profile/me/experience/`, form);
      }

      onSuccess(response.data);
      onClose();
    } catch (err) {
      setError("Failed to save experience");
    }

    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        {/* Close */}
        <button className="absolute right-4 top-4" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Experience" : "Add Experience"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded mb-4 flex gap-2 items-center">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {[
            ["role", "Role"],
            ["company", "Company"],
            ["employment_type", "Employment Type"],
            ["start_date", "Start Date", "date"],
            ["end_date", "End Date", "date"],
            ["notice_period", "Notice Period"],
            ["skills", "Skills (comma-separated)"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="text-sm font-medium">{label}</label>
              <input
                type={type || "text"}
                className="w-full border rounded-lg p-2 mt-1"
                value={form[name]}
                onChange={(e) =>
                  setForm({ ...form, [name]: e.target.value })
                }
              />
            </div>
          ))}

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full border rounded-lg p-2 mt-1"
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-5 bg-blue-600 text-white py-2 rounded-lg"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
