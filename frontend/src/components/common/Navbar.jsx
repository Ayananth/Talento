import { useCallback, useEffect, useMemo, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAuth from "@/auth/context/useAuth";
import { useUnread } from "@/context/UnreadContext";
import {
  getJobseekerNotifications,
  getJobseekerUnreadNotificationsCount,
  markAllJobseekerNotificationsRead,
  updateJobseekerNotificationReadStatus,
} from "@/apis/jobseeker/apis";


export function Navbar({ role }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [markingAllNotifications, setMarkingAllNotifications] = useState(false);
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [updatingNotificationId, setUpdatingNotificationId] = useState(null);


  const {
    totalUnread,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
  } = useUnread();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const userRole = user?.role;

  const isRecruiter = userRole === "recruiter";
  const isJobseeker = userRole === "jobseeker";
  const notificationPageSize = 10;
  const notificationTotalPages = Math.max(
    1,
    Math.ceil(notificationsCount / notificationPageSize)
  );

  useEffect(() => {
    if (isAuthenticated && isRecruiter && pathname === "/") {
      navigate("/recruiter", { replace: true });
    }
  }, [isAuthenticated, isRecruiter, pathname, navigate]);

  const fetchUnreadNotificationsCount = useCallback(async () => {
    if (!isAuthenticated || !isJobseeker) return;

    try {
      const count = await getJobseekerUnreadNotificationsCount();
      setUnreadNotificationsCount(count);
    } catch (error) {
      console.error("Failed to fetch unread notifications count", error);
    }
  }, [isAuthenticated, isJobseeker, setUnreadNotificationsCount]);

  const fetchNotifications = useCallback(async (page = notificationsPage) => {
    if (!isAuthenticated || !isJobseeker) return;

    try {
      setNotificationsLoading(true);
      const data = await getJobseekerNotifications({
        page,
        ordering: "-created_at",
      });

      setNotifications(data?.results || []);
      setNotificationsCount(data?.count || 0);
    } catch (error) {
      console.error("Failed to fetch jobseeker notifications", error);
    } finally {
      setNotificationsLoading(false);
    }
  }, [isAuthenticated, isJobseeker, notificationsPage]);

  useEffect(() => {
    fetchUnreadNotificationsCount();
  }, [fetchUnreadNotificationsCount, pathname]);

  useEffect(() => {
    if (!isAuthenticated || !isJobseeker) return;
    const intervalId = setInterval(fetchUnreadNotificationsCount, 30000);
    return () => clearInterval(intervalId);
  }, [fetchUnreadNotificationsCount, isAuthenticated, isJobseeker]);

  useEffect(() => {
    if (!notificationDrawerOpen) return;
    fetchNotifications(notificationsPage);
  }, [notificationDrawerOpen, notificationsPage, fetchNotifications]);

  useEffect(() => {
    if (!notificationDrawerOpen) return;

    const intervalId = setInterval(() => {
      fetchNotifications(notificationsPage);
      fetchUnreadNotificationsCount();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [
    notificationDrawerOpen,
    notificationsPage,
    fetchNotifications,
    fetchUnreadNotificationsCount,
  ]);

  const openNotificationDrawer = () => {
    setNotificationDrawerOpen(true);
    setNotificationsPage(1);
  };

  const closeNotificationDrawer = () => {
    setNotificationDrawerOpen(false);
  };

  const handleMarkRead = async (notificationId) => {
    try {
      setUpdatingNotificationId(notificationId);
      await updateJobseekerNotificationReadStatus(notificationId, true);
      await Promise.all([
        fetchNotifications(notificationsPage),
        fetchUnreadNotificationsCount(),
      ]);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      setUpdatingNotificationId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAllNotifications(true);
      await markAllJobseekerNotificationsRead();
      await Promise.all([
        fetchNotifications(notificationsPage),
        fetchUnreadNotificationsCount(),
      ]);
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    } finally {
      setMarkingAllNotifications(false);
    }
  };

  const formattedNotificationCount = useMemo(() => {
    if (unreadNotificationsCount > 99) return "99+";
    return unreadNotificationsCount;
  }, [unreadNotificationsCount]);

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

  const redirectNotification = (notification) => {
    if (notification.type === "JobMatchFound") {
      navigate("/jobs/" + notification.related_id);
      closeNotificationDrawer();
    }
    if (notification.type === "StatusChange") {
      navigate("/profile/applied-jobs/");
      closeNotificationDrawer();
    }
    if (notification.type === "SubscriptionEnd") {
      navigate("/premium");
      closeNotificationDrawer();
    }
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



            {isAuthenticated && (
              <div className="flex items-center gap-2">
                {/* Jobseeker-only */}
                {isJobseeker && (
                  <>
                    <button
                      onClick={() => handleNavigation("/messages")}
                      className="relative p-2 rounded-lg hover:bg-gray-100"
                    >
                      <MessageSquare size={20} />

                      {totalUnread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {totalUnread}
                        </span>
                      )}
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

                {/* Notifications (Jobseeker) */}
                {isJobseeker && (
                  <button
                    onClick={openNotificationDrawer}
                    className="relative p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Bell size={20} />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {formattedNotificationCount}
                      </span>
                    )}
                  </button>
                )}

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

      {/* Notification Drawer */}
      {notificationDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/35 z-40"
            onClick={closeNotificationDrawer}
          />

          <aside className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-white z-50 border-l border-gray-200 shadow-xl flex flex-col">
            <div className="px-4 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-500">
                  {notificationsCount} total · {unreadNotificationsCount} unread
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllRead}
                  disabled={markingAllNotifications || unreadNotificationsCount === 0}
                  className={`text-xs px-2.5 py-1.5 rounded-md border ${
                    markingAllNotifications || unreadNotificationsCount === 0
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {markingAllNotifications ? "Marking..." : "Mark all read"}
                </button>
                <button
                  onClick={closeNotificationDrawer}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-xl p-3 ${
                    notification.is_read ? "border-gray-200" : "border-blue-200 bg-blue-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {console.log("Notification:", notification)}
                    <div className="min-w-0" onClick={() => redirectNotification(notification)}>
                      <p className="text-sm font-semibold text-gray-900">
                        {notification.title || "Notification"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message || "No message"}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <span className="mt-1 w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>

                  {!notification.is_read && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={updatingNotificationId === notification.id}
                        className={`text-xs px-3 py-1.5 rounded-md border ${
                          updatingNotificationId === notification.id
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {updatingNotificationId === notification.id
                          ? "Saving..."
                          : "Mark as read"}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {!notificationsLoading && notifications.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-10">
                  No notifications yet.
                </div>
              )}

              {notificationsLoading && (
                <div className="text-center text-sm text-gray-500 py-4">
                  Loading notifications...
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t flex items-center justify-between">
              <button
                onClick={() => setNotificationsPage((prev) => Math.max(1, prev - 1))}
                disabled={notificationsPage <= 1}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg ${
                  notificationsPage <= 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {notificationsPage} of {notificationTotalPages}
              </span>

              <button
                onClick={() =>
                  setNotificationsPage((prev) =>
                    Math.min(notificationTotalPages, prev + 1)
                  )
                }
                disabled={notificationsPage >= notificationTotalPages}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg ${
                  notificationsPage >= notificationTotalPages
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </aside>
        </>
      )}
    </nav>
  );
}
