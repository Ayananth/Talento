import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/apis/api";

import RecruiterProfileForm from "../../../components/recruiter/forms/RecruiterProfileForm";

export default function RecruiterEditAfterRejectionPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  /* ---------------- Fetch recruiter profile ---------------- */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/v1/recruiter/profile/");
        const profile = res.data;

        // Only rejected recruiters should be here
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

          // New uploads (initially empty)
          logo: null,
          draft_business_registration_doc: null,

          // Existing draft files
          existing_logo: profile.draft_logo || null,
          existing_doc: profile.draft_business_registration_doc || null,
        });
      } catch (err) {
        console.error("Failed to fetch recruiter profile", err);
        navigate("/recruiter");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ---------------- Submit handler ---------------- */

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

      await api.post(
        "/v1/recruiter/profile/draft/update/",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Back to verification flow
      navigate("/recruiter");
    } catch (err) {
      console.error("Resubmission failed", err);
      setErrors(err.response?.data || {});
    }
  };

  /* ---------------- Loading ---------------- */

  if (loading || !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile…
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  console.log("initialData: ", initialData)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">

      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
            T
          </div>
          <span className="text-xl font-semibold">Talento</span>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="max-w-4xl mx-auto text-center mt-12 px-4">
        <h1 className="text-3xl font-bold">
          Edit & Resubmit Profile
        </h1>
        <p className="text-gray-600 mt-3">
          Please address the feedback below and resubmit your company
          profile for verification.
        </p>
      </section>

      {/* FORM */}
      <main className="flex-1 max-w-4xl mx-auto mt-10 px-4 pb-16 w-full">
        <div className="bg-white rounded-2xl shadow-sm border p-8">

          <RecruiterProfileForm
            initialData={initialData}
            onSubmit={handleResubmit}
            submitText="Resubmit for Review"
            showRejectionBanner
            rejectionReason={rejectionReason}
          />

        </div>
      </main>
    </div>
  );
}
