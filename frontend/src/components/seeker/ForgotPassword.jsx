import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  // COUNTDOWN TIMER
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // VALIDATE EMAIL
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SEND RESET REQUEST
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!validateForm()) return;

    if (cooldown > 0) {
      setMessage(`Please wait ${cooldown}s before trying again.`);
      return;
    }

    setLoading(true);

    try {
      await api.post("/v1/auth/request-password-reset/", { email });

      setMessage(
        "If an account exists, a reset link has been sent to your email."
      );

      setCooldown(60); // prevent repeated sending
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        
        <h3 className="text-center text-blue-600 font-medium mb-2">
          Reset your password
        </h3>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Enter your email to receive password reset instructions.
        </p>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Email address *
          </label>

          <input
            type="email"
            value={email}
            placeholder="example@mail.com"
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:outline-none ${
              errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Message */}
        {message && (
          <p className="text-center text-blue-700 text-sm mb-4">{message}</p>
        )}

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading || cooldown > 0}
          className={`w-full py-3 rounded-lg text-white font-medium transition 
            ${
              loading || cooldown > 0
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#0A2342] hover:bg-[#0c2d57]"
            }
          `}
        >
          {loading
            ? "Sending..."
            : cooldown > 0
            ? `Resend Email ${cooldown}`
            : "Send Reset Link"}
        </button>

        {/* Back to Login */}
        <p className="text-center text-gray-600 mt-4">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
