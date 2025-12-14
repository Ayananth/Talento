import { useState } from "react";
import {
  Upload,
  FileText,
  X,
  Image as ImageIcon,
  HelpCircle,
  Mail,
  ShieldCheck
} from "lucide-react";
import {  isValidEmail,isValidURL,validateFile,  MAX_LOGO_SIZE,  MAX_DOC_SIZE,} from "../../../utils/recruiter/utils"


export default function RecruiterOnboardingPage() {
  const [formData, setFormData] = useState({
    company_name: "",
    website: "",
    industry: "",
    company_size: "",
    about_company: "",
    phone: "",
    support_email: "",
    location: "",
    address: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    logo: null,
    business_registration_doc: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* -------------------- Handlers -------------------- */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      let error = null;

      if (name === "logo") {
        error = validateFile(
          file,
          ["image/jpeg", "image/png", "image/webp"],
          MAX_LOGO_SIZE
        );
      }

      if (name === "business_registration_doc") {
        error = validateFile(
          file,
          ["application/pdf", "image/jpeg", "image/png"],
          MAX_DOC_SIZE
        );
      }

      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
        return;
      }

      setErrors((prev) => ({ ...prev, [name]: null }));
      setFormData((prev) => ({ ...prev, [name]: file }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }

    if (!formData.support_email || !isValidEmail(formData.support_email)) {
      newErrors.support_email = "Valid support email is required";
    }

    if (formData.website && !isValidURL(formData.website)) {
      newErrors.website = "Invalid website URL";
    }

    ["linkedin", "facebook", "twitter"].forEach((field) => {
      if (formData[field] && !isValidURL(formData[field])) {
        newErrors[field] = "Invalid URL";
      }
    });

    if (formData.about_company && formData.about_company.length < 30) {
      newErrors.about_company =
        "Company description must be at least 30 characters";
    }

    if (formData.phone && formData.phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "Invalid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && payload.append(k, v));

    try {
      console.log("Submitting recruiter profile");
      // await api.post("/recruiter/profile/submit/", payload)
      alert("Application submitted for verification");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">

      {/* NAVBAR */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
            T
          </div>
          <span className="text-xl font-semibold">Talento</span>
        </div>
      </header>

      {/* HEADER */}
      <section className="max-w-4xl mx-auto text-center mt-12 px-4">
        <h1 className="text-3xl font-bold">Recruiter Verification</h1>
        <p className="text-gray-600 mt-3">
          To maintain trust on Talento, we verify all recruiters before enabling job postings.
        </p>
      </section>

      {/* FORM */}
      <main className="flex-1 max-w-4xl mx-auto mt-10 px-4 pb-16 w-full">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-10">

            <Section title="Company Information">
              <Grid>
                <Input name="company_name" placeholder="Company Name *" value={formData.company_name} onChange={handleChange} error={errors.company_name} />
                <Input name="website" placeholder="Website" value={formData.website} onChange={handleChange} error={errors.website} />
                <Input name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} />
                <Input name="company_size" placeholder="Company Size" value={formData.company_size} onChange={handleChange} />
                <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="md:col-span-2" />
              </Grid>

              <Textarea
                name="about_company"
                placeholder="About your company"
                value={formData.about_company}
                onChange={handleChange}
                error={errors.about_company}
              />

              <FileUploadField
                label="Company Logo"
                name="logo"
                type="image"
                file={formData.logo}
                error={errors.logo}
                onChange={handleChange}
                onRemove={() => setFormData((p) => ({ ...p, logo: null }))}
              />
            </Section>

            <Section title="Contact Information">
              <Grid>
                <Input name="support_email" placeholder="Support Email *" value={formData.support_email} onChange={handleChange} error={errors.support_email} />
                <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} />
              </Grid>
            </Section>

            <Section title="Address">
              <Textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} />
            </Section>

            <Section title="Social Links">
              <Grid>
                <Input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} error={errors.linkedin} />
                <Input name="facebook" placeholder="Facebook URL" value={formData.facebook} onChange={handleChange} error={errors.facebook} />
                <Input name="twitter" placeholder="Twitter / X URL" value={formData.twitter} onChange={handleChange} error={errors.twitter} />
              </Grid>
            </Section>

            <Section title="Business Verification">
              <FileUploadField
                label="Business Registration Document (PDF/Image)"
                name="business_registration_doc"
                file={formData.business_registration_doc}
                error={errors.business_registration_doc}
                onChange={handleChange}
                onRemove={() =>
                  setFormData((p) => ({ ...p, business_registration_doc: null }))
                }
              />
            </Section>

            <div className="pt-6 border-t flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit for Verification"}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap gap-6 text-sm text-gray-600">
          <FooterLink icon={<HelpCircle size={16} />} text="Support" />
          <FooterLink icon={<Mail size={16} />} text="Contact" />
          <FooterLink icon={<ShieldCheck size={16} />} text="Privacy" />
          <span>© {new Date().getFullYear()} Talento</span>
        </div>
      </footer>

      <InputStyles />
    </div>
  );
}

/* -------------------- Reusable Components -------------------- */

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ error, className = "", ...props }) => (
  <div className={className}>
    <input {...props} className="input" />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Textarea = ({ error, ...props }) => (
  <div>
    <textarea {...props} rows="4" className="input mt-4" />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const FileUploadField = ({ label, name, file, error, onChange, onRemove, type }) => (
  <div className="mt-4">
    <label className="block text-sm font-medium mb-2">{label}</label>

    {!file ? (
      <label className="flex items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-500">
        {type === "image" ? <ImageIcon /> : <FileText />}
        <span className="text-sm text-gray-600">Click to upload</span>
        <Upload size={16} />
        <input type="file" name={name} className="hidden" onChange={onChange} />
      </label>
    ) : (
      <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50">
        <span className="text-sm">{file.name}</span>
        <button type="button" onClick={onRemove} className="text-red-500">
          <X size={16} />
        </button>
      </div>
    )}

    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
  </div>
);

const FooterLink = ({ icon, text }) => (
  <div className="flex items-center gap-1">
    {icon} {text}
  </div>
);

const InputStyles = () => (
  <style>{`
    .input {
      width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 0.6rem;
      padding: 0.6rem 0.75rem;
      outline: none;
    }
    .input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 1px #2563eb;
    }
  `}</style>
);
