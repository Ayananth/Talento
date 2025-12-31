import { useEffect, useState } from "react";
import { Upload, Building2, AlertTriangle } from "lucide-react";
import {
  getRecruiterProfile,
  createRecruiterProfileDraft,
  updateRecruiterProfileDraft,
} from "../../apis/recruiter/apis";
import { getCloudinaryUrl } from "../../utils/common/getCloudinaryUrl";
import { popularCitiesInIndia } from "../../utils/common/utils";
import "./profile.css";
import Toast from "@/components/common/Toast";

const emptyProfile = {
  status: "",
  rejection_reason: "",
  company_name: "",
  website: "",
  industry: "",
  company_size: "",
  about_company: "",
  address: "",
  phone: "",
  support_email: "",
  location: "",
  linkedin: "",
  facebook: "",
  twitter: "",
  logo: null,
};

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function RecruiterProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [original, setOriginal] = useState(emptyProfile);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  /* ----------------------------------
     Fetch profile
  ---------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getRecruiterProfile();

        const mapped = {
          status: data.status || "",
          rejection_reason: data.rejection_reason || "",
          company_name: data.company_name || "",
          website: data.website || "",
          industry: data.industry || "",
          company_size: data.company_size || "",
          about_company: data.about_company || "",
          address: data.address || "",
          phone: data.phone || "",
          support_email: data.support_email || "",
          location: data.location || "",
          linkedin: data.linkedin || "",
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          logo: data.logo || null,
        };

        setForm(mapped);
        setOriginal(mapped);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ----------------------------------
     Change handler
  ---------------------------------- */
  const onChange = (e) => {
    const { name, value } = e.target;
    setErrors((p) => ({ ...p, [name]: null }));
    setFormError("");
    setForm({ ...form, [name]: value });
  };

  /* ----------------------------------
     Payload builders
  ---------------------------------- */
  const buildCreatePayload = () => {
    const payload = new FormData();
    Object.keys(form).forEach((key) => {
      if (
        key !== "status" &&
        key !== "rejection_reason" &&
        form[key] !== null
      ) {
        payload.append(key, form[key] === "" ? "" : form[key]);
      }
    });
    return payload;
  };

  const buildUpdatePayload = () => {
    const payload = new FormData();
    Object.keys(form).forEach((key) => {
      if (
        key !== "status" &&
        key !== "rejection_reason" &&
        form[key] !== original[key] &&
        form[key] !== null
      ) {
        payload.append(key, form[key] === "" ? "" : form[key]);
      }
    });
    return payload;
  };

  /* ----------------------------------
     Submit draft
  ---------------------------------- */
  const submitDraft = async () => {
    setSubmitting(true);
    setErrors({});
    setFormError("");

    try {
      if (form.status === "pending") {
        const payload = buildUpdatePayload();
        if ([...payload.keys()].length === 0) {
          setToast({ message: "No changes to submit", type: "error" });
          setSubmitting(false);
          return;
        }
        await updateRecruiterProfileDraft(payload);
      } else {
        const payload = buildCreatePayload();
        await createRecruiterProfileDraft(payload);
      }

      setToast({
        message: "Profile changes submitted for admin approval",
        type: "success",
      });

      setIsEditing(false);
      setForm({ ...form, status: "pending", rejection_reason: "" });
    } catch (err) {
      const data = err?.response?.data;

      if (!data) {
        setFormError("Something went wrong. Please try again.");
      } else if (data.detail) {
        setFormError(data.detail);
      } else {
        const fieldErrors = {};
        Object.keys(data).forEach((key) => {
          fieldErrors[key] = Array.isArray(data[key])
            ? data[key][0]
            : data[key];
        });
        setErrors(fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading profile…</div>;
  }

  const isPending = form.status === "pending";
  const isRejected = form.status === "rejected";

  return (
    <div className="max-w-6xl space-y-6">
      {/* Global error */}
      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Rejection banner */}
      {isRejected && form.rejection_reason && (
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertTriangle className="text-red-600 mt-1" />
          <div>
            <p className="font-semibold text-red-700">
              Profile Rejected by Admin
            </p>
            <p className="text-sm text-red-600 mt-1">
              {form.rejection_reason}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Company Profile
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        {/* Logo */}
        <div className="flex items-center gap-6 mb-8">
          <div className="h-24 w-24 rounded-lg border flex items-center justify-center bg-gray-50">
            {form.logo ? (
              <img
                src={getCloudinaryUrl(form.logo)}
                alt="logo"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <Building2 className="h-10 w-10 text-gray-400" />
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Company Name" error={errors.company_name}>
            <input
              className="input"
              name="company_name"
              value={form.company_name}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Industry" error={errors.industry}>
            <input
              className="input"
              name="industry"
              value={form.industry}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Website" error={errors.website}>
            <input
              className="input"
              name="website"
              value={form.website}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Company Size">
            <input
              className="input"
              name="company_size"
              value={form.company_size}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>
        </div>

        {/* About */}
        <div className="mt-6">
          <Field label="About Company" error={errors.about_company}>
            <textarea
              className="textarea"
              name="about_company"
              value={form.about_company}
              onChange={onChange}
              disabled={!isEditing}
              rows={4}
            />
          </Field>
        </div>

        {/* Address */}
        <div className="mt-6">
          <Field label="Address" error={errors.address}>
            <textarea
              className="textarea"
              name="address"
              value={form.address}
              onChange={onChange}
              disabled={!isEditing}
              rows={3}
            />
          </Field>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Field label="Phone" error={errors.phone}>
            <input
              className="input"
              name="phone"
              value={form.phone}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Support Email" error={errors.support_email}>
            <input
              className="input"
              name="support_email"
              value={form.support_email}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>
        </div>

        {/* Location & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Field label="Location" error={errors.location}>
            <select
              name="location"
              className="input"
              value={form.location}
              onChange={onChange}
              disabled={!isEditing}
            >
              <option value="">Select City</option>
              {popularCitiesInIndia.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </Field>

          <Field label="LinkedIn" error={errors.linkedin}>
            <input
              className="input"
              name="linkedin"
              value={form.linkedin}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Facebook" error={errors.facebook}>
            <input
              className="input"
              name="facebook"
              value={form.facebook}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Twitter / X" error={errors.twitter}>
            <input
              className="input"
              name="twitter"
              value={form.twitter}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg border text-sm"
            >
              Discard
            </button>
            <button
              onClick={submitDraft}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit for Approval"}
            </button>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
