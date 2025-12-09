import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EmailVerifiedFailed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    setLoading(true);

    try {
      // TODO: Call your backend API for resending verification email
      // await api.post("/v1/auth/resend-verification-email/", { email });

      alert("Verification email sent again!");
    } catch (error) {
      alert("Failed to resend verification email.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">

        {/* Animated Error Icon */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 text-red-600 animate-[pop_0.4s_ease-out]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Email Verification Failed
        </h1>

        <p className="text-gray-600 mb-6">
          The verification link may be invalid or expired.  
          Please try again.
        </p>

        {/* Resend Button */}
        {/* <button
          onClick={handleResendVerification}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-2 rounded-md w-full font-medium hover:bg-red-700 transition disabled:opacity-50 mb-3"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button> */}

        {/* Go to Login */}
        <button
          onClick={() => navigate("/login")}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md w-full font-medium hover:bg-gray-100 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
