import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../shared/api/api";

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setMessage("");

      await api.post("/v1/auth/resend-verification-email/", { email });

      setMessage("Verification email resent successfully.");
      startCooldown(30);
    } catch (err) {
      console.log(err);
      setMessage("Failed to resend email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = (seconds) => {
    setCooldown(seconds);

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="max-w-md w-full mx-auto">

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-4xl shadow-md">
          ✉️
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
        Check your email
      </h1>

      <p className="text-gray-600 text-center mb-2">
        A verification link has been sent to:
      </p>

      <p className="text-blue-700 text-xl font-semibold text-center mb-6">
        {email}
      </p>

      <p className="text-gray-500 text-center mb-8">
        Click the link in your inbox to activate your account.  
        Didn’t receive it?
      </p>

      {/* Resend Button */}
      <button
        onClick={handleResend}
        disabled={loading || cooldown > 0}
        className={`w-full py-3 rounded-lg text-white font-medium transition shadow-sm
          ${loading || cooldown > 0 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        {loading
          ? "Sending..."
          : cooldown > 0
          ? `Resend in ${cooldown}s`
          : "Resend Verification Email"}
      </button>

      {message && (
        <p className="text-green-600 text-center mt-4">{message}</p>
      )}

      <button
        onClick={() => navigate("/login")}
        className="text-blue-600 underline mt-6 block mx-auto"
      >
        Back to Login
      </button>
    </div>
  );
}
