import { useNavigate } from "react-router-dom";

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto w-full text-center">

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center 
                        justify-center shadow-md animate-[pop_0.4s_ease-out]">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Not Authorized
      </h1>

      <p className="text-gray-600 mb-6">
        You don’t have the required permission to access this page.
      </p>

      <button
        onClick={() => navigate("/")}
        className="w-full bg-red-600 text-white py-3 rounded-lg 
                   font-medium hover:bg-red-700 transition mb-3"
      >
        Go Back Home
      </button>

      <button
        onClick={() => navigate("/login")}
        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg 
                   font-medium hover:bg-gray-100 transition"
      >
        Login with a different account
      </button>
    </div>
  );
}
