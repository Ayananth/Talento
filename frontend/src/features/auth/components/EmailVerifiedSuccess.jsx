import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerifiedSuccess() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto w-full text-center">

      {/* Animated success icon */}
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center shadow-md 
                        animate-[pop_0.4s_ease-out]">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Email Verified Successfully!
      </h1>

      <p className="text-gray-600 mb-2">Your account is now active.</p>

      <p className="text-gray-600 mb-6">
        Redirecting in{" "}
        <span className="font-semibold text-green-600">{seconds}</span> seconds...
      </p>

      <button
        onClick={() => navigate("/login")}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
      >
        Go to Login
      </button>
    </div>
  );
}
