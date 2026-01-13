import { useEffect, useState } from "react";
import { AlertTriangle, Upload, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/apis/api";

export default function RecruiterResubmitPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  /* ---------------- Fetch existing draft ---------------- */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/v1/recruiter/profile/");
        const profile = res.data;

        if (profile.status !== "rejected") {
          navigate("/recruiter/dashboard");
          return;
        }

        setRejectionReason(profile.rejection_reason);

        setFormData({
          company_name: profile.pending_data?.company_name || "",
          website: profile.pending_data?.website || "",
          industry: profile.pending_data?.industry || "",
          company_size: profile.pending_data?.company_size || "",
          about_company: profile.pending_data?.about_company || "",
          phone: profile.pending_data?.phone || "",
          support_email: profile.pending_data?.support_email || "",
          location: profile.pending_data?.location || "",
          address: profile.pending_data?.address || "",
          linkedin: profile.pending_data?.linkedin || "",
          facebook: profile.pending_data?.facebook || "",
          twitter: profile.pending_data?.twitter || "",
          logo: null,
          business_registration_doc: null,
          existing_logo: profile.draft_logo,
          existing_doc: profile.draft_business_registration_doc,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.business_registration_doc && !formData.existing_doc) {
      setErrors({
        business_registration_doc:
          "Business registration document is required",
      });
      return;
    }

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([k, v]) => {
        if (
          v !== null &&
          !["existing_logo", "existing_doc"].includes(k)
        ) {
          payload.append(k, v);
        }
      });

      await api.post(
        "/v1/recruiter/profile/draft/update/",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigate("/recruiter/verification-pending");
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  if (loading || !formData) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">

        {/* Rejection Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex gap-3">
          <AlertTriangle className="text-red-600 mt-1" />
          <div>
            <p className="font-semibold text-red-700">
              Verification Rejected
            </p>
            <p className="text-sm text-red-600">
              {rejectionReason}
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-6">
          Edit & Resubmit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="input"
            placeholder="Company Name"
          />

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Business Registration Document *
            </label>

            {formData.existing_doc && !formData.business_registration_doc && (
              <div className="flex items-center justify-between border rounded p-3 mb-2">
                <span className="text-sm flex gap-2 items-center">
                  <FileText size={16} />
                  Existing document uploaded
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, existing_doc: null }))
                  }
                  className="text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {!formData.existing_doc && (
              <label className="upload-box">
                <Upload size={16} />
                Upload new document
                <input
                  type="file"
                  name="business_registration_doc"
                  onChange={handleChange}
                  hidden
                />
              </label>
            )}

            {errors.business_registration_doc && (
              <p className="text-red-500 text-sm mt-1">
                {errors.business_registration_doc}
              </p>
            )}
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Resubmit for Review
          </button>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.6rem;
        }
        .upload-box {
          border: 2px dashed #cbd5f5;
          padding: 1rem;
          border-radius: 0.75rem;
          display: flex;
          gap: 0.5rem;
          cursor: pointer;
          align-items: center;
          color: #2563eb;
        }
      `}</style>
    </div>
  );
}
