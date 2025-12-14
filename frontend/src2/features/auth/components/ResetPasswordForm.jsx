import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../shared/api/api";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get("uid");
  const token = queryParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showExpired, setShowExpired] = useState(false);

  // Validate inputs
  const validateForm = () => {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const normalizeErrorMsg = (raw) => {
    if (!raw) return "";
    if (Array.isArray(raw)) return String(raw[0] || "");
    if (typeof raw === "object") {
      const firstKey = Object.keys(raw)[0];
      const val = raw[firstKey];
      return Array.isArray(val) ? String(val[0] || "") : String(val);
    }
    return String(raw);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setServerMessage("");
    setShowExpired(false);

    if (!uid || !token) {
      setServerMessage("Missing reset token. Please request a new password reset link.");
      setShowExpired(true);
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post("/v1/auth/reset-password/", {
        uid,
        token,
        password,
      });

      setServerMessage("Password reset successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Reset error:", err);

      const respData = err?.response?.data;
      let msg = "";

      if (respData) {
        if (respData.token) msg = normalizeErrorMsg(respData.token);
        else if (respData.detail) msg = normalizeErrorMsg(respData.detail);
        else msg = normalizeErrorMsg(respData);
      } else {
        msg = err?.message || "Something went wrong";
      }

      const lower = msg.toLowerCase();

      if (lower.includes("invalid") || lower.includes("expired")) {
        setServerMessage("Your reset link is invalid or expired.");
        setShowExpired(true);
      } else {
        setServerMessage(msg || "Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h3 className="text-center text-indigo-600 font-medium mb-2">
        Create new password
      </h3>

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
        Reset Password
      </h1>

      <p className="text-center text-gray-500 mb-6">
        Enter a new password for your account.
      </p>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          New Password *
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="************"
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 pr-12 text-gray-700 focus:ring-2 focus:outline-none
            ${
              errors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Confirm Password *
        </label>

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            placeholder="************"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 pr-12 text-gray-700 focus:ring-2 focus:outline-none
            ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />

          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Server Message */}
      {serverMessage && (
        <p className="text-center text-gray-700 text-sm mb-4">
          {serverMessage}
        </p>
      )}

      {showExpired && (
        <p className="text-center mt-2">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-indigo-600 underline font-medium"
          >
            Request a new reset link
          </button>
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleReset}
        disabled={loading || showExpired}
        className={`w-full bg-[#0A2342] text-white py-3 rounded-lg text-lg font-medium transition
        ${
          loading || showExpired
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-[#0c2d57]"
        }`}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      <p className="text-center text-gray-600 mt-4">
        Remember your password?
        <span
          onClick={() => navigate("/login")}
          className="text-indigo-600 hover:underline cursor-pointer ml-1"
        >
          Login
        </span>
      </p>
    </div>
  );
}
