import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/context/useAuth";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";



export default function LoginForm({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 3)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      await login({ email, password, role: "admin" });
      navigate("/admin/dashboard");
    } catch (err) {
      setLoginError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 relative overflow-hidden">

      {/* Background Floating Circles */}
      <div className="absolute w-72 h-72 bg-blue-300 opacity-30 rounded-full blur-3xl -top-10 -left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-indigo-300 opacity-20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/70 backdrop-blur-md shadow-2xl p-8 rounded-2xl border border-white/40"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-full shadow-md">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900">
          Admin Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Secure access to your dashboard
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email *</label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:outline-none ${
                  errors.email ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="example@gmail.com"
              />
            </div>

            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password *</label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className={`w-full pl-10 pr-12 border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:outline-none ${
                  errors.password ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
                }`}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* API Error */}
          {loginError && <p className="text-red-600 text-sm mb-2">{loginError}</p>}

          {/* Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-800 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}