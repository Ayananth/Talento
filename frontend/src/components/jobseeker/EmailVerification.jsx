import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../apis/api";


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
      startCooldown(30); // 30-second button cooldown
    } catch (err) {
      console.log(err);
      setMessage("Failed to resend email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // simple cooldown countdown
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

<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100 text-center">

    <div className="flex flex-col items-center mb-6">
      <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
        ✔
      </div>
    </div>

    <h1 className="text-3xl font-bold text-gray-900 mb-4">
      Verify your email
    </h1>

    <p className="text-gray-600 mb-4">
      We sent a verification link to:
    </p>

    <p className="text-gray-900 font-semibold mb-6">
      {email}
    </p>

    <p className="text-gray-500 mb-8">
      Please check your inbox and click the link to activate your account.
    </p>

    {/* RESEND BUTTON */}
    <button
      onClick={handleResend}
      disabled={loading || cooldown > 0}
      className={`w-full py-3 rounded-lg text-white font-medium transition
        ${loading || cooldown > 0 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
      `}
    >
      {loading
        ? "Sending..."
        : cooldown > 0
        ? `Resend in ${cooldown}s`
        : "Resend Email"}
    </button>

    {message && (
      <p className="text-green-600 mt-4">{message}</p>
    )}

    <button
      onClick={() => navigate("/login")}
      className="text-blue-600 underline mt-6 block mx-auto"
    >
      Go to Login
    </button>
  </div>
</div>


  );
}
