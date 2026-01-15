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

    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errs = {};

    if (!formData.company_name) errs.company_name = "Required";
    if (!formData.support_email || !isValidEmail(formData.support_email))
      errs.support_email = "Invalid email";

    if (!formData.draft_business_registration_doc && !formData.existing_doc)
      errs.draft_business_registration_doc = "Required";

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
            <Input name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
            <Input name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" />
            <Input name="company_size" value={formData.company_size} onChange={handleChange} placeholder="Company Size" />
          </Grid>

          <Textarea name="about_company" value={formData.about_company} onChange={handleChange} placeholder="About company" />
        </Section>

        <Section title="Contact">
          <Grid>
            <Input name="support_email" value={formData.support_email} onChange={handleChange} error={errors.support_email} placeholder="Support Email *" />
            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
          </Grid>
        </Section>

        <Section title="Address">
          <Textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
        </Section>

        <Section title="Social Links">
          <Grid>
            <Input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn" />
            <Input name="facebook" value={formData.facebook} onChange={handleChange} placeholder="Facebook" />
            <Input name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter / X" />
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

const Textarea = (props) => (
  <textarea {...props} rows="4" className="input mt-2" />
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
