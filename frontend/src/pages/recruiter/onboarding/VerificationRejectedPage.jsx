import { XCircle, Edit3, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecruiterEditAfterRejectionPage from "./RecruiterProfileEditAfterRejectionPage";

/**
 * Props:
 * - rejectionReason (string) – admin message
 */
export default function RecruiterVerificationRejectedPage({
  rejectionReason,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex flex-col">

      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
            T
          </div>
          <span className="text-xl font-semibold text-gray-800">
            Talento
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border rounded-2xl shadow-sm max-w-md w-full p-8 text-center">

          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="text-red-600" size={28} />
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-semibold text-gray-900">
            Verification Rejected
          </h1>

          {/* MESSAGE */}
          <p className="text-gray-600 mt-3">
            Your company profile could not be approved at this time.
          </p>

          {/* ADMIN REASON */}
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-red-700 mb-1">
              Reason from Admin
            </p>
            <p className="text-sm text-red-800 whitespace-pre-line">
              {rejectionReason || "No reason provided."}
            </p>
          </div>

          {/* NEXT STEPS */}
          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <p>
              Please update the requested details and resubmit your profile for
              review.
            </p>
            <p>
              Once resubmitted, our team will review it again.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate("/recruiter/profile/resubmit")}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Edit3 size={16} />
              Edit & Resubmit Profile
            </button>

            <a
              href="/support"
              className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <HelpCircle size={16} />
              Need help? Contact support
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Talento. All rights reserved.
      </footer>
    </div>
  );
}
