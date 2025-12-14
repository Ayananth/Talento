import { useState } from "react";
import {
  HelpCircle,
  Mail,
  FileText,
  ShieldCheck
} from "lucide-react";

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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

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
          Submit your company details for verification before posting jobs.
        </p>
      </section>

      {/* FORM */}
      <main className="flex-1 max-w-4xl mx-auto mt-10 px-4 pb-16 w-full">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* COMPANY INFO */}
            <Section title="Company Information">
              <Grid>
                <Input name="company_name" required placeholder="Company Name *" value={formData.company_name} onChange={handleChange} />
                <Input name="website" placeholder="Website" value={formData.website} onChange={handleChange} />
                <Input name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} />
                <Input name="company_size" placeholder="Company Size (e.g. 11–50)" value={formData.company_size} onChange={handleChange} />
                <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="md:col-span-2" />
              </Grid>

              <Textarea
                name="about_company"
                placeholder="About your company"
                value={formData.about_company}
                onChange={handleChange}
              />

              <FileInput
                label="Company Logo (optional)"
                name="logo"
                accept="image/*"
                onChange={handleChange}
              />
            </Section>

            {/* CONTACT */}
            <Section title="Contact Information">
              <Grid>
                <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                <Input name="support_email" type="email" placeholder="Support Email" value={formData.support_email} onChange={handleChange} />
              </Grid>
            </Section>

            {/* ADDRESS */}
            <Section title="Address">
              <Textarea
                name="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleChange}
              />
            </Section>

            {/* SOCIAL */}
            <Section title="Social Links (optional)">
              <Grid>
                <Input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} />
                <Input name="facebook" placeholder="Facebook URL" value={formData.facebook} onChange={handleChange} />
                <Input name="twitter" placeholder="Twitter / X URL" value={formData.twitter} onChange={handleChange} />
              </Grid>
            </Section>

            {/* BUSINESS VERIFICATION */}
            <Section title="Business Verification">
              <FileInput
                label="Business Registration Document (PDF/Image)"
                name="business_registration_doc"
                accept=".pdf,image/*"
                onChange={handleChange}
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

const Input = ({ className = "", ...props }) => (
  <input {...props} className={`input ${className}`} />
);

const Textarea = (props) => (
  <textarea {...props} rows="4" className="input mt-4" />
);

const FileInput = ({ label, ...props }) => (
  <div className="mt-4">
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input type="file" {...props} />
  </div>
);

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
