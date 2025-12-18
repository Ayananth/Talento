import { useEffect, useState } from "react";
import { Upload, Building2 } from "lucide-react";
import { getRecruiterProfile } from "../../apis/recruiter/apis";
import "./profile.css";
import { getCloudinaryUrl } from "../../utils/common/getCloudinaryUrl";

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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getRecruiterProfile();

        setForm({
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
        });
      } catch (err) {
        console.error("Failed to load recruiter profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading recruiter profile…
      </div>
    );
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
            Manage your recruiter company information
          </p>
        </div>
<div className="flex items-center gap-3">
  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
    {form.status}
  </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm"
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
            <button className="px-3 py-2 border rounded-lg text-sm">
              <Upload className="inline h-4 w-4 mr-1" />
              Upload Logo
            </button>
          )}
        </div>

        {/* Basic info */}
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
              rows={4}
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
            <button className="px-4 py-2 rounded-lg bg-black text-white text-sm">
              Save & Submit for Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
