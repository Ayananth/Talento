import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CircleUser,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Bell,
  Bookmark,
  Briefcase,
} from "lucide-react";
import useAuth from "@/auth/context/useAuth";
import { useUnread } from "@/context/UnreadContext";


export function Navbar({ role }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);


  const { totalUnread } = useUnread();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const userRole = user?.role;

  const isRecruiter = userRole === "recruiter";
  const isJobseeker = userRole === "jobseeker";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (isAuthenticated && isRecruiter && pathname === "/") {
      navigate("/recruiter", { replace: true });
    }
  }, [isAuthenticated, isRecruiter, pathname, navigate]);

  const loginUrl =
    role === "recruiter"
      ? "/recruiter/login"
      : role === "admin"
      ? "/admin/login"
      : "/login";

  const signupUrl = role === "recruiter" ? "/recruiter/signup" : "/signup";

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
          {/* Logo */}
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 hover:opacity-80 transition rounded-lg"
          >
            <img src="/t.png" alt="Talento" className="h-12 w-12" />
            <span className="text-xl font-semibold hidden sm:inline">
              Talento
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated && role !== "admin" && (
              <>
                <button
                  onClick={() => handleNavigation(loginUrl)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation(signupUrl)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Sign Up
                </button>
              </>
            )}

{totalUnread > 0 && (
  <span className="badge">{totalUnread}</span>
)}

            {isAuthenticated && (
              <div className="flex items-center gap-2">
                {/* Jobseeker-only */}
                {isJobseeker && (
                  <>
                    <button
                      onClick={() => handleNavigation("/messages")}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <MessageSquare size={20} />
                    </button>

                    <button
                      onClick={() => handleNavigation("/profile/saved-jobs")}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Bookmark size={20} />
                    </button>
                  </>
                )}

                {/* Recruiter-only */}
                {isRecruiter && (
                  <button
                    onClick={() =>
                      handleNavigation("/recruiter/jobs")
                    }
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Briefcase size={20} />
                  </button>
                )}

                {/* Notifications */}
                {/* {!isAdmin && (
                  <button className="relative p-2 rounded-lg hover:bg-gray-100">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                )} */}

                {/* Profile */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
                  >
                    <CircleUser size={20} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                      <button
                        onClick={() =>
                          handleNavigation(
                            isRecruiter
                              ? "/recruiter/dashboard"
                              : "/profile"
                          )
                        }
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                        Dashboard
                      </button>

                      <div className="border-t" />

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex gap-2"
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

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-2">
          {isJobseeker && (
            <>
              <button onClick={() => handleNavigation("/messages")}>
                Messages
              </button>
              <button onClick={() => handleNavigation("/profile/saved-jobs")}>
                Saved Jobs
              </button>
            </>
          )}

          {isRecruiter && (
            <button
              onClick={() => handleNavigation("/recruiter/jobs")}
            >
              Posted Jobs
            </button>
          )}

          <button
            onClick={() =>
              handleNavigation(
                isRecruiter ? "/recruiter/dashboard" : "/profile"
              )
            }
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
