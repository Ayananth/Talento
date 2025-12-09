import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailVerifiedSuccess() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    // Countdown timer
    const countdown = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // Redirect timer
    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">

        {/* Animated Check Icon */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 text-green-600 animate-[pop_0.4s_ease-out]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Email Verified Successfully!
        </h1>

        <p className="text-gray-600 mb-2">
          Your email address has been verified.
        </p>

        <p className="text-gray-600 mb-6">
          You will be automatically redirected in{" "}
          <span className="font-semibold text-green-600">{seconds}</span> seconds...
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 text-white px-6 py-2 rounded-md w-full font-medium hover:bg-green-700 transition"
        >
          Go to Login Now
        </button>
      </div>
    </div>
  );
}
