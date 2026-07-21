import { Crown, Sparkles, ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIInsightCard({
  isLoginLocked = false,
  isPremiumLocked,
  loading,
  insight,
}) {
  const navigate = useNavigate();

  if (isLoginLocked) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
        {/* Blurred teaser behind the prompt */}
        <div className="pointer-events-none select-none blur-[6px]" aria-hidden="true">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-700" />
            <h3 className="text-lg font-semibold text-slate-900">AI Resume Insights</h3>
          </div>
          <p className="mb-4 text-sm text-slate-700">
            Your profile shows strong alignment with this role across key skills and experience.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-emerald-800">Strengths</p>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Relevant hands-on project experience</li>
                <li>• Core technical skills match the JD</li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-rose-700">Gaps</p>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• A few tools listed are unfamiliar</li>
                <li>• Slightly below preferred experience</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Login prompt overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/55 px-6 text-center backdrop-blur-[2px]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Log in to unlock AI insights for this job
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              See your match score, strengths, and gaps against this job description.
            </p>
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Log in
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
            >
              Sign up free
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isPremiumLocked) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-amber-100 p-2">
              <Crown className="text-amber-700" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">AI Resume Insights</h3>
              <p className="mt-1 text-sm text-slate-700">
                Upgrade to premium to unlock personalized strengths, gaps, and hiring summary for this job.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/premium")}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Get Subscription
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Generating AI insights...</p>
      </div>
    );
  }

  if (!insight) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-emerald-700" />
        <h3 className="text-lg font-semibold text-slate-900">AI Resume Insights</h3>
      </div>

      <p className="mb-4 text-sm text-slate-700">{insight.summary || "No summary available."}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-emerald-800">Strengths</p>
          <ul className="space-y-1 text-sm text-slate-700">
            {(insight.strengths || []).length ? (
              insight.strengths.map((item, index) => <li key={index}>• {item}</li>)
            ) : (
              <li>• No strengths found.</li>
            )}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-rose-700">Gaps</p>
          <ul className="space-y-1 text-sm text-slate-700">
            {(insight.gaps || []).length ? (
              insight.gaps.map((item, index) => <li key={index}>• {item}</li>)
            ) : (
              <li>• No major gaps found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
