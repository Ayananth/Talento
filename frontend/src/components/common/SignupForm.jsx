import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "@/auth/context/useAuth"
import GoogleLoginButton from "./GoogleLoginButton";


const SignupForm = ({role}) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);               // General or backend error
  const [fieldErrors, setFieldErrors] = useState({});     // For per-field errors
  const [loading, setLoading] = useState(false);          // Disable button + spinner

const resolveAuthMessage = (err, fallback) => {
  const msg = typeof err?.message === "string" ? err.message.trim() : "";
  if (msg && !/^\d{3}$/.test(msg)) return msg;
  return fallback;
};

useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => setError(null), 4000);
  return () => clearTimeout(timer);
}, [error]);


  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmed: "",
  });



  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear field-specific errors when user edits the input
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: "",
    });
    setError(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setFieldErrors({});

  if (form.password !== form.password_confirmed) {
    setFieldErrors({ password_confirmed: "Passwords do not match" });
    return;
  }

  try {
    setLoading(true);
    await register({ ...form, role });
    navigate("/email-verification", { state: { email: form.email } });
  } catch (err) {
    if (err.fields && Object.keys(err.fields).length > 0) {
      setFieldErrors(err.fields);
    } else {
      setError(resolveAuthMessage(err, "Signup failed. Please try again."));
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">

        <h3 className="text-center text-blue-600 font-medium mb-2">Register</h3>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Start for free Today
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Access all features. No credit card required.
        </p>

        <button className="w-full flex items-center justify-center gap-3  border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
          {/* <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span> */}

        {/* <GoogleLoginButton role={"jobseeker"} /> */}
          {role !== "admin" && <GoogleLoginButton role={role} setAuthError={setError} />}


        </button>

        {/* Google Login */}
        {/* <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button> */}

        <div className="flex items-center my-6">
          <hr className="grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">Or continue with</span>
          <hr className="grow border-gray-300" />
        </div>

        {/* FORM START */}
        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Name *</label>
            <input
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className={`w-full border ${fieldErrors.username ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {fieldErrors.username && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email address *
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className={`w-full border ${fieldErrors.email ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password *
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="************"
              className={`w-full border ${fieldErrors.password ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password *
            </label>
            <input
              name="password_confirmed"
              type="password"
              required
              value={form.password_confirmed}
              onChange={handleChange}
              placeholder="************"
              className={`w-full border ${fieldErrors.password_confirmed ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {fieldErrors.password_confirmed && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.password_confirmed}
              </p>
            )}
          </div>

          {/* Checkbox */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-gray-700 text-sm">
              <input type="checkbox" className="h-4 w-4" required />
              Agree to Terms & Conditions
            </label>
            <button type="button" className="text-blue-600 hover:underline text-sm">
              Learn More
            </button>
          </div>

          {/* GENERAL ERROR */}
          {error && (
            <div className="text-red-600 text-center mb-4">{error}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg text-lg font-medium transition 
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#0A2342] hover:bg-[#0c2d57]"}`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
