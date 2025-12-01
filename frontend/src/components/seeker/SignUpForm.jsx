import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmed: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      setError("Signup failed");
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

        {/* Google Button */}
        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>

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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Terms */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-gray-700 text-sm">
              <input type="checkbox" className="h-4 w-4" required />
              Agree to Terms & Conditions
            </label>
            <button type="button" className="text-blue-600 hover:underline text-sm">
              Learn More
            </button>
          </div>

          {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0A2342] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#0c2d57] transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an Account?{" "}
          <a className="text-blue-600 hover:underline cursor-pointer" href="/login">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
