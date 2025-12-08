import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EmailVerifiedFailed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    setLoading(true);

    try {
      // TODO: Call your backend API to resend email
      // await api.post("/v1/auth/resend-verification-email/", { email });
      alert("Verification email sent again!");
    } catch (error) {
      alert("Failed to resend verification email.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto w-full text-center">

      {/* Error Icon */}
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center shadow-md
                        animate-[pop_0.4s_ease-out]">
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
        Verification Failed
      </h1>

      <p className="text-gray-600 mb-6">
        The verification link may be invalid or expired.  
        Please request a new one to continue.
      </p>

      {/* Resend Button */}
      <button
        onClick={handleResendVerification}
        disabled={loading}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-medium 
                   hover:bg-red-700 transition disabled:opacity-50 mb-4"
      >
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>

      {/* Login Button */}
      <button
        onClick={() => navigate("/login")}
        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg 
                   font-medium hover:bg-gray-100 transition"
      >
        Go to Login
      </button>
    </div>
  );
}
