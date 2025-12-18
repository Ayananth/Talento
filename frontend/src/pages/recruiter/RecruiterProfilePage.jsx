import { useEffect, useState } from "react";
import { Upload, Building2 } from "lucide-react";
import {
  getRecruiterProfile,
  createRecruiterProfileDraft,
  updateRecruiterProfileDraft,
} from "../../apis/recruiter/apis";
import { getCloudinaryUrl } from "../../utils/common/getCloudinaryUrl";
import "./profile.css";

const emptyProfile = {
  status: "",
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
  logo: null,
};

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export default function RecruiterProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [original, setOriginal] = useState(emptyProfile); // published snapshot
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ----------------------------------
     Fetch published profile
  ---------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getRecruiterProfile();

        const mapped = {
          status: data.status || "",
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
          logo: data.logo || null,
        };

        setForm(mapped);
        setOriginal(mapped);
      } catch (err) {
        console.error("Failed to load recruiter profile", err);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ----------------------------------
     BUILD PAYLOADS
  ---------------------------------- */

  // ✅ FULL payload for CREATE (required fields must exist)
  const buildCreatePayload = () => {
    const payload = new FormData();

    Object.keys(form).forEach((key) => {
      if (key !== "status" && form[key] !== null) {
        payload.append(key, form[key]);
      }
    });

    return payload;
  };

  // ✅ PARTIAL payload for UPDATE (only changed fields)
  const buildUpdatePayload = () => {
    const payload = new FormData();

    Object.keys(form).forEach((key) => {
      if (
        key !== "status" &&
        form[key] !== original[key] &&
        form[key] !== null
      ) {
        payload.append(key, form[key]);
      }
    });

    return payload;
  };

  /* ----------------------------------
     Submit Draft (CREATE or UPDATE)
  ---------------------------------- */
  const submitDraft = async () => {
    setSubmitting(true);
    try {
      if (form.status === "pending") {
        // UPDATE existing draft
        const payload = buildUpdatePayload();

        if ([...payload.keys()].length === 0) {
          alert("No changes to submit");
          setSubmitting(false);
          return;
        }

        await updateRecruiterProfileDraft(payload);
      } else {
        // CREATE new draft (approved / rejected)
        const payload = buildCreatePayload();
        await createRecruiterProfileDraft(payload);
      }

      alert("Profile changes submitted for admin approval");
      setIsEditing(false);
      setForm({ ...form, status: "pending" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to submit changes");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading profile…</div>;
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Company Profile
          </h1>
          <p className="text-sm text-gray-500">
            Changes require admin approval
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            {form.status}
          </span>

          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={form.status === "pending"}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
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

          {isEditing && (
            <input
              type="file"
              name="draft_logo"
              onChange={(e) =>
                setForm({ ...form, draft_logo: e.target.files[0] })
              }
            />
          )}
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Company Name">
            <input
              className="input"
              name="company_name"
              value={form.company_name}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Industry">
            <input
              className="input"
              name="industry"
              value={form.industry}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Website">
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
          <Field label="About Company">
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
          <Field label="Address">
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
          <Field label="Phone">
            <input
              className="input"
              name="phone"
              value={form.phone}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Support Email">
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
          <Field label="Location">
            <input
              className="input"
              name="location"
              value={form.location}
              onChange={onChange}
              disabled={!isEditing}
            />
          </Field>

          <Field label="LinkedIn">
            <input
              className="input"
              name="linkedin"
              value={form.linkedin}
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
              {submitting ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
