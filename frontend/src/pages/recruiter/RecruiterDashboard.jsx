import { Crown } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import UpgradeBanner from "../../components/jobseeker/UpgradeBanner";
import useAuth from "../../auth/context/useAuth"
import { useSearchParams } from "react-router-dom";
import Toast from "@/components/common/Toast";
import { useState, useEffect } from "react";



const formatExpiry = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RecruiterDashboard = () => {
  const { subscription } = useAuth();
  const isPro = subscription?.is_active;
   const [searchParams, setSearchParams] = useSearchParams();
   const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setToastMessage("🎉 You have unlocked Pro features!");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("payment");
      setSearchParams(newParams, { replace: true });
    }
  }, []);

  return (
    <div>
      {/* PRO INFO (permanent UI) */}
      {isPro && (
        <div className="flex items-center gap-3 mb-6 text-sm text-slate-700">
          <Crown size={16} className="text-yellow-500" />
          <span className="font-medium text-slate-900">
            Pro membership
          </span>
          <span className="text-slate-500">
            · Valid till {formatExpiry(subscription?.end_date)}
          </span>
        </div>
      )}

      {/* FREE USER CTA */}
      {!isPro && <UpgradeBanner role="recruiter" />}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
      

      <h1 className="text-xl font-semibold">
        This is recruiter dashboard
      </h1>
    </div>
  );
};

export default RecruiterDashboard;
