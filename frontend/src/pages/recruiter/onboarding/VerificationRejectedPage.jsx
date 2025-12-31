import { XCircle,HelpCircle, Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/apis/api";

import RecruiterProfileForm from "../../../components/recruiter/forms/RecruiterProfileForm";

export default function VerificationRejectedPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/v1/recruiter/profile/");
        const profile = res.data;

        if (profile.status !== "rejected") {
          navigate("/recruiter");
          return;
        }

        setRejectionReason(profile.rejection_reason || "");

        setInitialData({
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

          existing_logo: profile.draft_logo || null,
          existing_doc: profile.draft_business_registration_doc || null,
        });
      } catch (err) {
        console.error(err);
        navigate("/recruiter");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleResubmit = async (formData, setErrors) => {
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

      await api.patch(
        "/v1/recruiter/profile/draft/update/",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigate(0);
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  if (loading || !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex flex-col">

      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
            T
          </div>
          <span className="text-xl font-semibold">Talento</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Rejection Card */}
          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="text-red-600" size={28} />
              </div>
            </div>

            <h1 className="text-2xl font-semibold">Verification Rejected</h1>
            <p className="text-gray-600 mt-3">
              Please fix the issues below and resubmit.
            </p>

            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-red-700 mb-1">
                Reason from Admin
              </p>
              <p className="text-sm text-red-800 whitespace-pre-line">
                {rejectionReason}
              </p>
            </div>
            <a
              href="/support"
              className="flex items-center justify-center gap-2 mt-5 text-sm text-blue-600 hover:underline"
            >
              <HelpCircle size={16} />
              Need help? Contact support
            </a>
          </div>

          {/* Form */}
          <div className="bg-white border rounded-2xl shadow-sm p-8">
            <RecruiterProfileForm
              initialData={initialData}
              onSubmit={handleResubmit}
              submitText="Resubmit for Review"
            />

          </div>

        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Talento
      </footer>
    </div>
  );
}
