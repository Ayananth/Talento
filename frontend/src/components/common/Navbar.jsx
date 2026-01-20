import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CircleUser, LogOut, Menu, X, MessageSquare, Bell, Bookmark, Briefcase } from 'lucide-react';
import useAuth from "../../auth/context/useAuth";


export function Navbar({ role }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isRecruiter = pathname.includes("/recruiter/");
  const loginUrl = isRecruiter ? "/recruiter/login" : "/login";
  const signupUrl = isRecruiter ? "/recruiter/signup" : "/signup";

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav
  className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm"
  style={{ height: "72px" }}
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label="Talento Home"
          >
            <img src="/t.png" alt="Talento" className="h-12 w-12" />
            <span className="text-xl font-semibold text-gray-900 tracking-tight hidden sm:inline">
              Talento
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated && role !== "admin" && (
              <>
                <button
                  onClick={() => handleNavigation(loginUrl)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation(signupUrl)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </>
            )}

            {isAuthenticated && (
              <div className="flex items-center gap-2">
                {/* Messages Icon */}
                <button
                  onClick={() => handleNavigation("/messages")}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  aria-label="Messages"
                  title="Messages"
                >
                  <MessageSquare size={20} />
                </button>

                {/* Notifications Icon */}
                <button
                  className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Saved Jobs Icon (Jobseeker only) */}
                {!isRecruiter && (
                  <button
                    onClick={() => handleNavigation("/shortlisted")}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    aria-label="Saved Jobs"
                    title="Saved Jobs"
                  >
                    <Bookmark size={20} />
                  </button>
                )}

                {/* Posted Jobs Icon (Recruiter only) */}
                {isRecruiter && (
                  <button
                    onClick={() => handleNavigation("/recruiter/jobs")}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    aria-label="Posted Jobs"
                    title="Posted Jobs"
                  >
                    <Briefcase size={20} />
                  </button>
                )}

                {/* Profile Menu */}
                <div className="relative ml-2 border-l border-gray-200 pl-2">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    aria-label="User menu"
                    aria-expanded={profileOpen}
                  >
                    <CircleUser size={20} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Dashboard
                      </button>
                      <div className="border-t border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {!isAuthenticated && role !== "admin" && (
              <>
                <button
                  onClick={() => handleNavigation(loginUrl)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation(signupUrl)}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}

            {isAuthenticated && (
              <>
                <button
                  onClick={() => handleNavigation("/messages")}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <MessageSquare size={18} />
                  Messages
                </button>

                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors relative"
                >
                  <Bell size={18} />
                  Notifications
                  <span className="absolute right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {!isRecruiter && (
                  <button
                    onClick={() => handleNavigation("/shortlisted")}
                    className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                    <Bookmark size={18} />
                    Saved Jobs
                  </button>
                )}

                {isRecruiter && (
                  <button
                    onClick={() => handleNavigation("/recruiter/jobs")}
                    className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                    <Briefcase size={18} />
                    Posted Jobs
                  </button>
                )}

                <div className="border-t border-gray-200 my-2" />

                <button
                  onClick={() => handleNavigation("/profile")}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <CircleUser size={18} />
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
