import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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

  const [errors, setErrors] = useState({});
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
      setErrors({});
    } else if (isOpen) {
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
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors = {};
    const today = new Date();

    const start = form.start_date ? new Date(form.start_date) : null;
    const end = form.end_date ? new Date(form.end_date) : null;

    // Required fields
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.company.trim()) newErrors.company = "Company is required";
    if (!form.employment_type.trim()) newErrors.employment_type = "Employment type is required";
    if (!form.start_date) newErrors.start_date = "Start date is required";

    // Start date validation
    if (start && start > today)
      newErrors.start_date = "Start date cannot be in the future";

    // End date validation
    if (end) {
      if (end < start)
        newErrors.end_date = "End date cannot be before start date";
      if (end.getTime() === start.getTime())
        newErrors.end_date = "Start and end date cannot be the same";
      if (end > today)
        newErrors.end_date = "End date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);

    try {
      let response;

      if (initialData) {
        response = await api.patch(
          `/v1/profile/me/experience/${initialData.id}/`,
          form
        );
      } else {
        response = await api.post(`/v1/profile/me/experience/`, form);
      }

      onSuccess(response.data);
      onClose();
    } catch (err) {
      setErrors({ general: "Failed to save experience" });
    }

    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <button className="absolute right-4 top-4 text-gray-600" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Experience" : "Add Experience"}
        </h2>

        {errors.general && (
          <p className="text-red-600 mb-3">{errors.general}</p>
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
                className={`w-full border rounded-lg p-2 mt-1 ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              />
              {errors[name] && (
                <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className={`w-full border rounded-lg p-2 mt-1 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
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
