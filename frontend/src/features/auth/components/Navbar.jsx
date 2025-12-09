import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from '../context/useAuth'
import { User } from 'lucide-react';
import { CircleUser } from 'lucide-react';


export function Navbar({role}) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, logout } = useAuth();
  console.log("isAuthenticated", isAuthenticated)

  const isRecruiter = pathname.includes("/recruiter/");
  const loginUrl = isRecruiter ? "/recruiter/login" : "/login";
  const signupUrl = isRecruiter ? "/recruiter/signup" : "/signup";

  const linkStyle =
    "text-gray-700 hover:text-blue-600 transition font-medium relative group";

  return (
    <nav className="backdrop-blur-xl bg-white/70 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <img src="/src/assets/react.svg" alt="logo" className="h-9 w-9" />
          <span className="text-2xl font-semibold text-gray-800 tracking-tight">
            Talento
          </span>
        </div>


        {/* RIGHT SECTION */}
        <div className="hidden md:flex items-center space-x-5">

          {/* BEFORE LOGIN */}
          {!isAuthenticated && (
            <>
              <button
                onClick={() => navigate(loginUrl)}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Login
              </button>

              <button
                onClick={() => navigate(signupUrl)}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
              >
                Sign Up
              </button>
            </>
          )}

          {/* AFTER LOGIN */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
              >
                <CircleUser />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-xl py-3 w-48 border border-gray-100 animate-fadeIn">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-7 h-7 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden flex flex-col space-y-3 px-6 pb-4 border-t pt-3 bg-white/90 backdrop-blur-lg">



          {!isAuthenticated && (
            <>
              <button
                onClick={() => navigate(loginUrl)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate(signupUrl)}
                className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </>
          )}

          {isAuthenticated && (
            <>
              <button
                onClick={logout}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Logout
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Dashboard
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
