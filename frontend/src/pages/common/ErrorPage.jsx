import React from "react";
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  const status = error?.status || 404;
  const title =
    status === 401
      ? "Unauthorized"
      : status === 403
      ? "Access Denied"
      : "Page Not Found";

  const message =
    status === 401
      ? "Please login to continue."
      : status === 403
      ? "You don’t have permission to view this page."
      : "The page you are looking for does not exist or was moved.";

  return (
    <div className="flex justify-center items-center min-h-screen py-20 px-4 bg-gray-50">
      <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-white/40">

        {/* LEFT SECTION – BRAND / ILLUSTRATION */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Talento
          </h1>

          <p className="text-lg opacity-90 text-center">
            Oops! Something went wrong.
          </p>

          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/404-error-3702359-3119148.png"
            alt="Error Illustration"
            className="w-80 mt-10 drop-shadow-2xl"
          />
        </div>

        {/* RIGHT SECTION – ERROR CONTENT */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {title}
          </h2>

          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {error && (
            <p className="text-sm text-gray-400 mb-6">
              {error.statusText || error.message}
            </p>
          )}

          <div className="flex gap-4">
            <Link
              to="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Go Back
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ErrorPage;
