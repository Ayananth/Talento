import { HelpCircle, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/apis/api";

import RecruiterProfileForm from "@/components/recruiter/forms/RecruiterProfileForm";

export default function RecruiterOnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ---------------- Initial empty data ---------------- */

  const initialData = {
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

    // required by reusable form
    existing_logo: null,
    existing_doc: null,
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (formData, setErrors) => {
    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== "" &&
          !["existing_logo", "existing_doc"].includes(key)
        ) {
          payload.append(key, value);
        }
      });

      await api.post(
        "/v1/recruiter/profile/draft/create/",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // let RecruiterRedirect decide next screen
      navigate(0);
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

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
          <RecruiterProfileForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitText="Submit for Verification"
            loading={loading}
          />
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
    </div>
  );
}

/* ---------------- Footer helper ---------------- */

const FooterLink = ({ icon, text }) => (
  <div className="flex items-center gap-1">
    {icon} {text}
  </div>
);
