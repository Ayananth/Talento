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

    // Prepare form data (important for file upload)
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    try {
      // TODO: replace with real API
      console.log("Submitting recruiter verification:", Object.fromEntries(payload));

      // await api.post("/recruiter/verify/", payload)

      alert("Application submitted for verification");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-semibold mb-2">
          Recruiter Verification
        </h1>
        <p className="text-gray-600 mb-6">
          Complete your company details to get verified and start posting jobs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Company Info */}
          <section>
            <h2 className="text-lg font-medium mb-4">Company Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="company_name"
                placeholder="Company Name *"
                required
                value={formData.company_name}
                onChange={handleChange}
                className="input"
              />

              <input
                name="website"
                placeholder="Company Website"
                value={formData.website}
                onChange={handleChange}
                className="input"
              />

              <input
                name="industry"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleChange}
                className="input"
              />

              <input
                name="company_size"
                placeholder="Company Size (e.g. 10-50)"
                value={formData.company_size}
                onChange={handleChange}
                className="input"
              />

              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="input md:col-span-2"
              />
            </div>

            <textarea
              name="about_company"
              placeholder="About the company"
              rows="4"
              value={formData.about_company}
              onChange={handleChange}
              className="input mt-4"
            />

            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">
                Company Logo (optional)
              </label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <h2 className="text-lg font-medium mb-4">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="contact_name"
                placeholder="Contact Person Name *"
                required
                value={formData.contact_name}
                onChange={handleChange}
                className="input"
              />

              <input
                name="contact_email"
                placeholder="Official Email *"
                required
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                className="input"
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="input md:col-span-2"
              />
            </div>
          </section>

          {/* Submit */}
          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>

      {/* Tailwind input utility */}
      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
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
