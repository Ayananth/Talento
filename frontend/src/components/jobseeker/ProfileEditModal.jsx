import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, Loader2 } from "lucide-react";
import api from "../../apis/api";

export default function ProfileEditModal({ isOpen, onClose, initialData, onSuccess }) {
  const [form, setForm] = useState({
    fullname: "",
    headline: "",
    address: "",
    current_salary: "",
    experience_years: "",
    notice_period: "",
    phone_number: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");


  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        fullname: initialData?.fullname ?? "",
        headline: initialData?.headline ?? "",
        address: initialData?.address ?? "",
        current_salary: initialData?.current_salary ?? "",
        experience_years: initialData?.experience_years ?? "",
        notice_period: initialData?.notice_period ?? "",
        phone_number: initialData?.phone_number ?? "",
        email: initialData?.email ?? "",
      });
      setErrors({});
      setSubmitError("");
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, submitting]);

  const validate = () => {
    const newErr = {};

    if (!form.fullname.trim()) newErr.fullname = "Fullname is required";
    if (!form.headline.trim()) newErr.headline = "Headline is required";
    if (!form.address.trim()) newErr.address = "Address is required";

    if (form.current_salary && !/^\d+$/.test(form.current_salary))
      newErr.current_salary = "Salary must be numeric";

    if (!/^\d+$/.test(form.experience_years))
      newErr.experience_years = "Experience must be numeric";

    if (!form.notice_period.trim())
      newErr.notice_period = "Notice period required";

    if (!/^[0-9]{10}$/.test(form.phone_number))
      newErr.phone_number = "Phone number must be 10 digits";

    if (!/\S+@\S+\.\S+/.test(form.email))
      newErr.email = "Invalid email";

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await api.patch("/v1/profile/me/update/", form);
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.log(err);
      setSubmitError("Failed to update profile. Please try again.");
    }

    setSubmitting(false);
  };

  if (!isOpen) return null;

  const fields = [
    {
      key: "fullname",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      type: "text",
    },
    {
      key: "headline",
      label: "Headline",
      placeholder: "e.g. Frontend Developer | React",
      required: true,
      type: "text",
    },
    {
      key: "address",
      label: "Location",
      placeholder: "City, State",
      required: true,
      type: "text",
    },
    {
      key: "current_salary",
      label: "Current Salary",
      placeholder: "e.g. 1200000",
      type: "text",
      inputMode: "numeric",
    },
    {
      key: "experience_years",
      label: "Experience (Years)",
      placeholder: "e.g. 3",
      required: true,
      type: "text",
      inputMode: "numeric",
    },
    {
      key: "notice_period",
      label: "Notice Period",
      placeholder: "e.g. 30 days",
      required: true,
      type: "text",
    },
    {
      key: "phone_number",
      label: "Phone Number",
      placeholder: "10-digit phone number",
      required: true,
      type: "tel",
      inputMode: "numeric",
      maxLength: 10,
    },
    {
      key: "email",
      label: "Email",
      placeholder: "you@example.com",
      required: true,
      type: "email",
    },
  ];

  const modal = (
    <div
      className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-[2px] sm:p-6"
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        className="mx-auto my-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_55px_-25px_rgba(15,23,42,0.5)] sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/70 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit Profile</h2>
            <p className="mt-1 text-sm text-slate-600">
              Keep these details current to improve recruiter responses.
            </p>
          </div>
          <button
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-5">
          {submitError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className={field.key === "headline" || field.key === "address" ? "sm:col-span-2" : ""}>
                <label htmlFor={field.key} className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-500">*</span>}
                </label>

                <input
                  id={field.key}
                  type={field.type}
                  inputMode={field.inputMode}
                  maxLength={field.maxLength}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition ${
                    errors[field.key]
                      ? "border-red-300 ring-2 ring-red-100"
                      : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />

                {errors[field.key] && (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
