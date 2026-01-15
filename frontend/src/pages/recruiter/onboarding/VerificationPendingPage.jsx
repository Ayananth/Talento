import { Clock, CheckCircle, HelpCircle,LogOut } from "lucide-react";
import useAuth from "../../../auth/context/useAuth";

export default function VerificationPendingPage() {
  const {logout} = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">

      {/* HEADER */}
      <header className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                    T
                  </div>
                  <span className="text-xl font-semibold text-gray-800">
                    Talento
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </header>

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border rounded-2xl shadow-sm max-w-md w-full p-8 text-center">

          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="text-blue-600" size={28} />
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-semibold text-gray-900">
            Verification in Progress
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-600 mt-3">
            Your company profile has been successfully submitted and is
            currently under review by our admin team.
          </p>

          {/* STATUS */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg py-2">
            <Clock size={16} />
            Status: Pending Review
          </div>

          {/* INFO */}
          <div className="mt-6 text-sm text-gray-500 space-y-2">
            <p>
              ⏱️ Review usually takes <strong>24–48 hours</strong>.
            </p>
            <p>
              You’ll be notified once your profile is approved or if changes
              are required.
            </p>
          </div>

          {/* ACTION */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 py-2.5 rounded-lg cursor-not-allowed"
            >
              Post a Job (Disabled)
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
