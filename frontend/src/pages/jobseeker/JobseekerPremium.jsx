import React, { useState, useEffect } from "react";
import {
  Check,
  Zap,
  Target,
  FileText,
  Eye,
  Activity,
  Sparkles,
} from "lucide-react";
import api from "@/apis/api";

/**
 * Static premium features (UI-only, safe to hardcode)
 */
const features = [
  {
    icon: Zap,
    title: "Unlimited job applications",
    description: "Apply to as many jobs as you want without restrictions",
  },
  {
    icon: Target,
    title: "Auto-apply to matching jobs",
    description: "Automatically apply to jobs that match your profile",
  },
  {
    icon: FileText,
    title: "Resume optimization & ATS score",
    description: "Get your resume optimized for applicant tracking systems",
  },
  {
    icon: Eye,
    title: "Priority recruiter visibility",
    description: "Stand out and get noticed by recruiters first",
  },
  {
    icon: Activity,
    title: "Application status tracking",
    description: "Track all your applications in real-time",
  },
  {
    icon: Sparkles,
    title: "AI-powered job recommendations",
    description: "Get personalized job matches powered by AI",
  },
];

export default function JobseekerPremium() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch subscription plans from backend
   * GET /api/subscriptions/plans/
   */
  useEffect(() => {
    api
      .get("v1/subscriptions/plans/")
      .then((res) => setPlans(res.data))
      .catch((err) => {
        console.error("Failed to load plans", err);
      });
  }, []);

  /**
   * Checkout handler
   */
  const handleCheckout = async () => {
    if (!selectedPlan || loading) return;

    try {
      setLoading(true);

      // 1️⃣ Create Razorpay order
      const res = await api.post("v1/subscriptions/create-order/", {
        plan_id: selectedPlan.id,
      });

      const order = res.data;

      // 2️⃣ Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount * 100, // paise
        currency: "INR",
        name: "Talento Pro",
        description: "Premium Subscription",
        order_id: order.order_id,

        handler: async function (response) {
          // 3️⃣ Verify payment
          await api.post(
            "v1/subscriptions/verify-payment/",
            response
          );

          alert("🎉 Subscription activated successfully!");
          window.location.reload();
        },

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Limited Time Offer
          </span>
          <h1 className="text-5xl font-bold text-white mb-4">
            Talento Pro
          </h1>
          <p className="text-xl text-white/90">
            Unlock your career potential with premium features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ===== FEATURES ===== */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10">
            Premium Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== PLANS ===== */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-10">
            Choose Your Plan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id
                    ? "ring-2 ring-blue-500 shadow-lg scale-105"
                    : "border hover:shadow-md"
                }`}
              >
                {selectedPlan?.id === plan.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="text-center pt-4">
                  <h3 className="text-xl font-bold mb-2">
                    {plan.duration_months} Month
                    {plan.duration_months > 1 ? "s" : ""}
                  </h3>

                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      ₹{plan.price}
                    </span>
                  </div>

                  {plan.duration_months > 1 && (
                    <p className="text-sm text-slate-600">
                      ₹
                      {Math.round(
                        plan.price / plan.duration_months
                      )}
                      /month
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CHECKOUT BUTTON ===== */}
        <div className="flex justify-center">
          <button
            onClick={handleCheckout}
            disabled={!selectedPlan || loading}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              selectedPlan && !loading
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Continue to Checkout"}
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Contact us at support@talento.com
        </p>
      </div>
    </div>
  );
}
