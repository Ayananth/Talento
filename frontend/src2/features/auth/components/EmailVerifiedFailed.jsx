import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EmailVerifiedFailed() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  // Auto-redirect to jobseeker signup
  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/signup");
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto w-full text-center">

      {/* Error Icon */}
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center shadow-md animate-[pop_0.4s_ease-out]">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Email Verification Failed
      </h1>

      <p className="text-gray-600 mb-2">
        The verification link is invalid or expired.
      </p>

      <p className="text-gray-600 mb-6">
        Please register again to receive a new verification email.
      </p>

      <p className="text-gray-600 mb-6">
        Redirecting in{" "}
        <span className="font-semibold text-red-600">{seconds}</span> seconds...
      </p>

      {/* Register Again Button */}
      <button
        onClick={() => navigate("/signup")}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-medium 
                   hover:bg-red-700 transition"
      >
        Register Again
      </button>

      {/* Optional: login button */}
      <button
        onClick={() => navigate("/login")}
        className="w-full border border-gray-300 text-gray-700 mt-3 py-3 
                   rounded-lg font-medium hover:bg-gray-100 transition"
      >
        Go to Login
      </button>

    </div>
  );
}
