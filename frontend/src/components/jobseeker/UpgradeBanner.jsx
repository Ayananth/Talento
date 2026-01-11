// components/subscription/UpgradeBanner.jsx
import { Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpgradeBanner({ role = "jobseeker" }) {
  const navigate = useNavigate();

  const jobseekerMessage =
    "Get AI job matches, resume analyzer, and priority visibility";
  const recruiterMessage =
    "Join Pro and recruit faster with priority access";

  const jobseekerPath = "/premium";
  const recruiterPath = "/recruiter/premium";

  const isRecruiter = role === "recruiter";

  const message = isRecruiter ? recruiterMessage : jobseekerMessage;
  const path = isRecruiter ? recruiterPath : jobseekerPath;

  return (
    <div className="mb-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-100">
            <Crown className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Unlock Talento Pro
            </h3>
            <p className="text-sm text-slate-600">{message}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(path)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
        >
          Upgrade Now
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
