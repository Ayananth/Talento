import React, { useState } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";


export default function LoginForm() {
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
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    else if (password.length < 3) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    // return true only if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    
    // Validate before API call
    if (!validateForm()) return;

    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setLoginError("Login failed. Check your credentials.");
      console.error(err);
    } finally{
      setLoading(false)
    }
  };

  const handleNavigate = () => navigate("/signup");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">

        <h3 className="text-center text-blue-600 font-medium mb-2">
          Welcome back!
        </h3>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Member Login
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Access to all features. No credit card required.
        </p>

        <button className="w-full flex items-center justify-center gap-3  border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
          {/* <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span> */}

        <GoogleLoginButton />

        </button>

        {/* <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">

        <GoogleLoginButton />
        </button> */}


        {/* <GoogleLoginButton /> */}



        <div className="flex items-center my-6">
          <hr className="grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">Or continue with</span>
          <hr className="grow border-gray-300" />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Username or Email address *
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Password *
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="************"
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 pr-12 text-gray-700 focus:ring-2 focus:outline-none ${
                errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
              }`}
            />

            {/* Toggle Button */}
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

        

        {/* Options */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input type="checkbox" className="h-4 w-4" />
            Remember me
          </label>
          <button
           onClick={()=> navigate('/forgot-password')}
           className="text-blue-600 hover:underline text-sm">
            Forgot Password
          </button>
        </div>

        {/* Login API error */}
        {loginError && (
          <div className="text-red-600 text-sm mb-4">{loginError}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#0A2342] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#0c2d57] transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup */}
        <p className="text-center text-gray-600 mt-4">
          Don’t have an Account?{" "}
          <span
            onClick={handleNavigate}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>

      {/* Right Image */}
      {/* <div className="hidden lg:flex ml-20">
        <img
          src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
          alt="Illustration"
          className="h-64 opacity-80"
        />
      </div> */}
    </div>
  );
}
