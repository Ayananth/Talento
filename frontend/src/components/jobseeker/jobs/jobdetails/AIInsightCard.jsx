import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIInsightCard({
  isPremiumLocked,
  loading,
  insight,
}) {
  const navigate = useNavigate();

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
