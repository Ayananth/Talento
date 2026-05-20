import {
  Upload,
  FileText,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import {
  isValidEmail,
  isValidURL,
  validateFile,
  MAX_LOGO_SIZE,
  MAX_DOC_SIZE,
} from "@/utils/recruiter/utils";
import { useEffect, useState, useRef } from "react";
import { getCloudinaryUrl } from "../../../utils/common/getCloudinaryUrl";

export default function RecruiterProfileForm({
  initialData,
  onSubmit,
  submitText = "Submit",
  loading = false,
}) {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const initialized = useRef(false);


  useEffect(() => {
    if (!initialized.current && initialData) {
      setFormData(initialData);
      initialized.current = true;
    }
  }, [initialData]);

  if (!formData) return null;

  const validateField = (name, rawValue, currentForm = formData) => {
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

    switch (name) {
      case "company_name":
        if (!value) return "Company name is required";
        if (value.length < 2) return "Company name must be at least 2 characters";
        return null;
      case "support_email":
        if (!value) return "Support email is required";
        if (!isValidEmail(value)) return "Enter a valid email address";
        return null;
      case "website":
        if (!value) return null;
        if (!isValidURL(value)) return "Enter a valid website URL";
        return null;
      case "phone":
        if (!value) return null;
        if (!/^[0-9+\-\s()]{7,20}$/.test(value)) return "Enter a valid phone number";
        return null;
      case "industry":
        if (!value) return "Industry is required";
        return null;
      case "company_size":
        if (!value) return "Company size is required";
        return null;
      case "address":
        if (!value) return "Address is required";
        return null;
      case "about_company":
        if (!value) return "About company is required";
        if (value.length < 20) return "Please add at least 20 characters";
        return null;
      case "linkedin":
      case "facebook":
      case "twitter":
        if (!value) return null;
        if (!isValidURL(value)) return "Enter a valid URL";
        return null;
      case "draft_business_registration_doc":
        if (!currentForm.draft_business_registration_doc && !currentForm.existing_doc) {
          return "Business registration document is required";
        }
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      let error = null;

      if (name === "logo") {
        error = validateFile(file, ["image/jpeg", "image/png"], MAX_LOGO_SIZE);
      }

      if (name === "draft_business_registration_doc") {
        error = validateFile(
          file,
          ["application/pdf", "image/jpeg", "image/png"],
          MAX_DOC_SIZE
        );
      }

      if (error) {
        setErrors((p) => ({ ...p, [name]: error }));
        return;
      }

      setErrors((p) => ({ ...p, [name]: null }));
      setFormData((p) => ({ ...p, [name]: file }));
      return;
    }

    setFormData((p) => {
      const next = { ...p, [name]: value };
      const fieldError = validateField(name, value, next);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
      return next;
    });
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errs = {};

    const fieldsToValidate = [
      "company_name",
      "support_email",
      "website",
      "phone",
      "industry",
      "company_size",
      "address",
      "about_company",
      "linkedin",
      "facebook",
      "twitter",
      "draft_business_registration_doc",
    ];
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field], formData);
      if (fieldError) errs[field] = fieldError;
    });

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    await onSubmit(formData, setErrors);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">

        <Section title="Company Information">
          <Grid>
            <Input name="company_name" value={formData.company_name} onChange={handleChange} error={errors.company_name} placeholder="Company Name *" />
            <Input name="website" value={formData.website} onChange={handleChange} error={errors.website} placeholder="Website (https://example.com)" />
            <Input name="industry" value={formData.industry} onChange={handleChange} error={errors.industry} placeholder="Industry *" />
            <Input name="company_size" value={formData.company_size} onChange={handleChange} error={errors.company_size} placeholder="Company Size *" />
          </Grid>

          <Textarea name="about_company" value={formData.about_company} onChange={handleChange} error={errors.about_company} placeholder="About company *" />
        </Section>

        <Section title="Contact">
          <Grid>
            <Input name="support_email" value={formData.support_email} onChange={handleChange} error={errors.support_email} placeholder="Support Email *" />
            <Input name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="Phone" />
          </Grid>
        </Section>

        <Section title="Address">
          <Textarea name="address" value={formData.address} onChange={handleChange} error={errors.address} placeholder="Address *" />
        </Section>

        <Section title="Social Links">
          <Grid>
            <Input name="linkedin" value={formData.linkedin} onChange={handleChange} error={errors.linkedin} placeholder="LinkedIn" />
            <Input name="facebook" value={formData.facebook} onChange={handleChange} error={errors.facebook} placeholder="Facebook" />
            <Input name="twitter" value={formData.twitter} onChange={handleChange} error={errors.twitter} placeholder="Twitter / X" />
          </Grid>
        </Section>

        <Section title="Business Verification">
          <FileUploadField
            label="Business Registration Document *"
            name="draft_business_registration_doc"
            file={formData.draft_business_registration_doc}
            existing={formData.existing_doc}
            error={errors.draft_business_registration_doc}
            onChange={handleChange}
            onRemove={() =>
              setFormData((p) => ({
                ...p,
                draft_business_registration_doc: null,
                existing_doc: null,
              }))
            }
          />
        </Section>

        {/* SUBMIT */}
        <div className="pt-6 border-t flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2.5 rounded-lg flex items-center gap-2
              ${loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"}
              text-white`}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {submitText}
          </button>
        </div>
      </form>

      <InputStyles />
    </>
  );
}

/* ---------- UI helpers ---------- */

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ error, ...props }) => (
  <div>
    <input {...props} className="input" />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const Textarea = ({ error, ...props }) => (
  <div>
    <textarea {...props} rows="4" className="input mt-2" />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const FileUploadField = ({
  label,
  name,
  file,
  existing,
  onChange,
  onRemove,
  error,
}) => {
  const handleOpen = () => {
    let url;

    if (file) {
      // Local file preview
      url = URL.createObjectURL(file);
      url = getCloudinaryUrl(url)
    } else if (existing) {
      // Existing uploaded file URL
      url = existing;
    }

    if (!url) return;

    // Open in new tab (browser handles view/download)
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      {!file && !existing ? (
        <label className="upload-box">
          <FileText />
          Upload document
          <input type="file" name={name} hidden onChange={onChange} />
        </label>
      ) : (
        <div className="flex items-center justify-between border p-3 rounded gap-3">
          {/* CLICKABLE FILE NAME */}
          <button
            type="button"
            onClick={handleOpen}
            className="flex items-center gap-2 text-blue-600 hover:underline truncate"
          >
            <FileText size={18} />
            <span className="truncate">
              {file?.name || "View existing document"}
            </span>
          </button>

          {/* REMOVE */}
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-500 hover:text-red-600"
          >
            <X />
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};


const InputStyles = () => (
  <style>{`
    .input {
      width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 0.6rem;
      padding: 0.6rem;
      background: white;
    }
    .upload-box {
      border: 2px dashed #cbd5f5;
      padding: 1rem;
      border-radius: 0.75rem;
      display: flex;
      gap: 0.5rem;
      cursor: pointer;
      color: #2563eb;
    }
  `}</style>
);
