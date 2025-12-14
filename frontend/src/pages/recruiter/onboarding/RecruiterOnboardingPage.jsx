import { useState } from "react";

export default function RecruiterOnboardingPage() {
  const [formData, setFormData] = useState({
    company_name: "",
    website: "",
    industry: "",
    company_size: "",
    location: "",
    about_company: "",
    contact_name: "",
    contact_email: "",
    phone: "",
    logo: null,
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
    Object.entries(formData).forEach(([k, v]) => v && payload.append(k, v));

    try {
      console.log("Submitting recruiter verification");
      // await api.post("/recruiter/verify/", payload)
      alert("Application submitted for verification");
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      
      {/* NAVBAR */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            T
          </div>
          <span className="text-xl font-semibold text-gray-800">
            Talento
          </span>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="max-w-4xl mx-auto text-center mt-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Recruiter Verification
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          To ensure trust and quality on Talento, we verify all recruiters
          before allowing job postings.
        </p>
      </section>

      {/* FORM CARD */}
      <main className="max-w-4xl mx-auto mt-10 px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* COMPANY INFO */}
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Company Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="company_name" required placeholder="Company Name *" value={formData.company_name} onChange={handleChange} className="input" />
                <input name="website" placeholder="Company Website" value={formData.website} onChange={handleChange} className="input" />
                <input name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} className="input" />
                <input name="company_size" placeholder="Company Size (e.g. 11–50)" value={formData.company_size} onChange={handleChange} className="input" />
                <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="input md:col-span-2" />
              </div>

              <textarea
                name="about_company"
                rows="4"
                placeholder="Brief description about your company"
                value={formData.about_company}
                onChange={handleChange}
                className="input mt-4"
              />

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Company Logo (optional)
                </label>
                <input type="file" name="logo" accept="image/*" onChange={handleChange} />
              </div>
            </section>

            {/* CONTACT INFO */}
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="contact_name" required placeholder="Contact Person Name *" value={formData.contact_name} onChange={handleChange} className="input" />
                <input name="contact_email" required type="email" placeholder="Official Email *" value={formData.contact_email} onChange={handleChange} className="input" />
                <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input md:col-span-2" />
              </div>
            </section>

            {/* SUBMIT */}
            <div className="pt-6 border-t flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit for Verification"}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* INPUT STYLE */}
      <style>
        {`
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
        `}
      </style>
    </div>
  );
}
