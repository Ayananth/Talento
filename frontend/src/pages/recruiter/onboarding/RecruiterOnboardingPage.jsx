import { useState } from "react";
import {
  HelpCircle,
  Mail,
  FileText,
  ShieldCheck,
  Upload,
  Image,
  X
} from "lucide-react";
import {  isValidEmail,isValidURL,validateFile,  MAX_LOGO_SIZE,  MAX_DOC_SIZE,} from "../../../utils/recruiter/utils"


export default function RecruiterOnboardingPage() {
  const [errors, setErrors] = useState({});
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

  const [loading, setLoading] = useState(false);

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
        "Company description should be at least 30 characters";
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
      console.log("Submitting recruiter profile", payload);
        // await api.post("/recruiter/profile/submit/", payload)
        alert("Application submitted for verification");
    } catch (error) {
        alert("Something went wrong");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">

      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg text-white flex items-center justify-center font-bold">
            T
          </div>
          <span className="text-xl font-semibold">Talento</span>
        </div>
      </header>

      {/* TITLE */}
      <section className="max-w-4xl mx-auto text-center mt-12 px-4">
        <h1 className="text-3xl font-bold">
          Recruiter Verification
        </h1>
        <p className="text-gray-600 mt-3">
          To maintain trust on Talento, we verify all recruiters before enabling job postings.
        </p>
      </section>

      {/* FORM */}
      <main className="flex-1 max-w-4xl mx-auto mt-10 px-4 pb-16 w-full">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* COMPANY INFO */}
            <Section title="Company Information">
              <Grid>
                <Input name="company_name" required placeholder="Company Name *" value={formData.company_name} onChange={handleChange}  error={errors.company_name} />
                <Input name="website" placeholder="Website" value={formData.website} onChange={handleChange}  error={errors.website}/>
                <Input name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} />
                <Input name="company_size" placeholder="Company Size (e.g. 11–50)" value={formData.company_size} onChange={handleChange}  error={errors.company_size}/>
                <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="md:col-span-2"  error={errors.location}/>
              </Grid>

              <Textarea
                name="about_company"
                placeholder="About your company"
                value={formData.about_company}
                onChange={handleChange}
                 error={errors.about_company}
              />

            <FileUploadField
            label="Company Logo (optional)"
            name="logo"
            type="image"
            accept="image/*"
            file={formData.logo}
            onChange={handleChange}
            onRemove={() =>
                setFormData((prev) => ({ ...prev, logo: null }))
            }
            error={errors.logo}
            />
            </Section>

            {/* CONTACT */}
            <Section title="Contact Information">
              <Grid>
                <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange}  error={errors.phone}/>
                <Input name="support_email" type="email" placeholder="Support Email" value={formData.support_email} onChange={handleChange}  error={errors.support_email}/>
              </Grid>
            </Section>

            {/* ADDRESS */}
            <Section title="Address">
              <Textarea
                name="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleChange}
                 error={errors.address}
              />
            </Section>

            {/* SOCIAL */}
            <Section title="Social Links (optional)">
              <Grid>
                <Input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange}  error={errors.linkedin}/>
                <Input name="facebook" placeholder="Facebook URL" value={formData.facebook} onChange={handleChange}  error={errors.facebook}/>
                <Input name="twitter" placeholder="Twitter / X URL" value={formData.twitter} onChange={handleChange} error={errors.twitter}/>
              </Grid>
            </Section>

            {/* BUSINESS VERIFICATION */}
            <Section title="Business Verification">
                <FileUploadField
                label="Business Registration Document (PDF / Image)"
                name="business_registration_doc"
                accept=".pdf,image/*"
                file={formData.business_registration_doc}
                onChange={handleChange}
                onRemove={() =>
                    setFormData((prev) => ({ ...prev, business_registration_doc: null }))
                }
                error={errors.business_registration_doc}
                />

            </Section>

            {/* SUBMIT */}
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
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-between gap-4 text-sm text-gray-600">
          <FooterLink icon={<HelpCircle size={16} />} text="Support" href="/support" />
          <FooterLink icon={<Mail size={16} />} text="Contact" href="/contact" />
          <FooterLink icon={<FileText size={16} />} text="Terms" href="/terms" />
          <FooterLink icon={<ShieldCheck size={16} />} text="Privacy" href="/privacy" />
          <span>© {new Date().getFullYear()} Talento</span>
        </div>
      </footer>

      <InputStyles />
    </div>
  );
}

/* ------------------ Reusable UI Components ------------------ */

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
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


const Textarea = (props) => (
  <textarea {...props} rows="4" className="input mt-4" />
);

const FileUploadField = ({
  label,
  name,
  accept,
  file,
  onChange,
  onRemove,
  type = "file", // "file" | "image"
}) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {!file ? (
        <label className="flex items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-500 transition">
          {type === "image" ? (
            <Image className="text-gray-400" />
          ) : (
            <FileText className="text-gray-400" />
          )}
          <span className="text-sm text-gray-600">
            Click to upload
          </span>
          <Upload className="text-gray-400" size={16} />
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={onChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            {type === "image" ? <Image size={16} /> : <FileText size={16} />}
            {file.name}
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
  <p className="text-red-500 text-xs mt-2">{error}</p>
)}

    </div>
  );
};

const FooterLink = ({ icon, text, href }) => (
  <a href={href} className="flex items-center gap-1 hover:text-blue-600">
    {icon} {text}
  </a>
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
