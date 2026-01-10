import React, { useState } from 'react';
import { Check, Zap, Target, FileText, Eye, Activity, Sparkles } from 'lucide-react';

// Plans data structure
const plans = [
  {
    id: 1,
    duration: '1 Month',
    price: 999,
    period: 'month',
    savings: null,
    badge: null
  },
  {
    id: 2,
    duration: '3 Months',
    price: 2499,
    period: '3 months',
    savings: '17% off',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 3,
    duration: '6 Months',
    price: 4499,
    period: '6 months',
    savings: '25% off',
    badge: 'Best Value',
    badgeColor: 'bg-green-500'
  }
];

// Premium features data
const features = [
  {
    icon: Zap,
    title: 'Unlimited job applications',
    description: 'Apply to as many jobs as you want without restrictions'
  },
  {
    icon: Target,
    title: 'Auto-apply to matching jobs',
    description: 'Automatically apply to jobs that match your profile'
  },
  {
    icon: FileText,
    title: 'Resume optimization & ATS score',
    description: 'Get your resume optimized for applicant tracking systems'
  },
  {
    icon: Eye,
    title: 'Priority recruiter visibility',
    description: 'Stand out and get noticed by recruiters first'
  },
  {
    icon: Activity,
    title: 'Application status tracking',
    description: 'Track all your applications in real-time'
  },
  {
    icon: Sparkles,
    title: 'AI-powered job recommendations',
    description: 'Get personalized job matches powered by AI'
  }
];

export default function JobseekerPremium() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Handle checkout
  const handleCheckout = () => {
    if (selectedPlan) {
      console.log('Selected Plan Data:', selectedPlan);
      console.log('Proceeding to checkout...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Premium Subscription</h1>
          <p className="mt-2 text-slate-600">Unlock your career potential with premium features</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Premium Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Premium Features</h2>
            <p className="text-slate-600">Everything you need to accelerate your job search</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription Plans Section */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Choose Your Plan</h2>
            <p className="text-slate-600">Select the plan that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative bg-white rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                    : 'border border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span
                      className={`${plan.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Selection Indicator */}
                {selectedPlan?.id === plan.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="text-center pt-4">
                  {/* Duration */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {plan.duration}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">₹{plan.price}</span>
                    <span className="text-slate-600 ml-1">/{plan.period}</span>
                  </div>

                  {/* Savings */}
                  {plan.savings && (
                    <div className="mb-4">
                      <span className="inline-block bg-green-50 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {plan.savings}
                      </span>
                    </div>
                  )}

                  {/* Per Month Breakdown */}
                  {plan.id !== 1 && (
                    <p className="text-sm text-slate-600">
                      ₹{Math.round(plan.price / (plan.id === 2 ? 3 : 6))}/month
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCheckout}
            disabled={!selectedPlan}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              selectedPlan
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Continue to Checkout
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            All plans include a 7-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}