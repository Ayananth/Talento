import { useEffect, useState } from "react";
import api from "@/apis/api";

import RecruiterOnboardingPage from "../../pages/recruiter/onboarding/RecruiterOnboardingPage";
import VerificationPendingPage from "../../pages/recruiter/onboarding/VerificationPendingPage";
import VerificationRejectedPage from "../../pages/recruiter/onboarding/VerificationRejectedPage";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";

export default function RecruiterRedirect() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  console.log("RecruiterRedirect component running...")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/v1/recruiter/profile/");
        setProfile(res.data);
        console.log("profile: ", profile)
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile(null);
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking verification status...
      </div>
    );
  }

  /**
   * No profile → first-time onboarding
   */

  console.log(profile)


  if (!profile) {
    console.log("Onboardig")
    return <RecruiterOnboardingPage />;
  }

  /**
   * First submission flow (no published data yet)
   */
  if (!profile.has_published_data) {
    if (profile.status === "pending") {
      return <VerificationPendingPage />;
    }

    if (profile.status === "rejected") {
      return (
        <VerificationRejectedPage
          rejectionReason={profile.rejection_reason}
        />
      );
    }
  }

  /**
   * Published data exists → recruiter can operate
   * (even if an edit is pending or rejected)
   */
  if (profile.has_published_data) {
    return <RecruiterDashboard />;
  }

  /**
   * Fallback (should never happen)
   */
  return (
    <div className="p-10 text-center text-red-500">
      Invalid recruiter state
    </div>
  );
}
