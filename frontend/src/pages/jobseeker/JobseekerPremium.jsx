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

import {
  getSubscriptionPlans,
  createSubscriptionOrder,
  verifySubscriptionPayment,
} from "../../apis/common/subscriptions/subscriptions";

import { useNavigate } from "react-router-dom";
import api from "../../apis/api";
import useAuth from "../../auth/context/useAuth";



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

export default function JobseekerPremium({navigateTo="/profile?payment=success"}) {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const {fetchSubscription} = useAuth();



  /**
   * Fetch subscription plans from backend
   * GET /api/subscriptions/plans/
   */
useEffect(() => {
  getSubscriptionPlans()
    .then(setPlans)
    .catch((err) => {
      console.error("Failed to load plans", err);
    });
}, []);


useEffect(() => {
  api.get("v1/subscriptions/status/")
    .then(res => setSubscriptionStatus(res.data))
    .catch(() => {});
}, []);

useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => {
    setError(null);
  }, 5000); // 5 seconds

  return () => clearTimeout(timer);
}, [error]);

  /**
   * Checkout handler
   */
const handleCheckout = async () => {
  if (!selectedPlan || loading) return;

  try {
    setError(null);
    setLoading(true);

    const order = await createSubscriptionOrder(selectedPlan.id);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount * 100,
      currency: "INR",
      name: "Talento Pro",
      description: "Premium Subscription",
      order_id: order.order_id,

      handler: async (response) => {
        await verifySubscriptionPayment(response);
        await fetchSubscription()
        navigate(navigateTo);
      },

      modal: {
        ondismiss: function () {
          setError("Payment was cancelled. You can try again anytime.");
        },
      },

      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function () {
      setError("Payment failed. Your amount was not deducted.");
    });

    rzp.open();
  } catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

if (subscriptionStatus?.is_active) {
  return (
    <div className="max-w-xl mx-auto mt-20 bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-2">
        You’re already a Pro user 🎉
      </h2>
      <p className="mb-4">
        Your subscription is valid until{" "}
        <strong>
          {new Date(subscriptionStatus.end_date).toLocaleDateString()}
        </strong>
      </p>
      <button
        onClick={() => navigate("/profile")}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Go to Profile
      </button>
    </div>
  );
}



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
{plans.map((plan) => {
  const badge = getPlanBadge(plan);

  return (
    <div
      key={plan.id}
      onClick={() => setSelectedPlan(plan)}
      className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all ${
        selectedPlan?.id === plan.id
          ? "ring-2 ring-blue-500 shadow-lg scale-105"
          : "border hover:shadow-md"
      }`}
    >
      {/* 🔖 Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span
            className={`${badge.color} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}
          >
            {badge.label}
          </span>
        </div>
      )}

      {/* Selected indicator */}
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
          <span className="text-4xl font-bold">₹{plan.price}</span>
        </div>

        {plan.duration_months > 1 && (
          <p className="text-sm text-slate-600">
            ₹{Math.round(plan.price / plan.duration_months)}/month
          </p>
        )}
      </div>
    </div>
  );
})}

          </div>
        </div>


{error && (
  <div className="mb-6 max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
    {error}
  </div>
)}



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

const getPlanBadge = (plan) => {
  if (plan.duration_months === 3) {
    return {
      label: "Most Popular",
      color: "bg-blue-500",
    };
  }

  if (plan.duration_months === 6) {
    return {
      label: "Best Value",
      color: "bg-green-500",
    };
  }

  return null;
};

