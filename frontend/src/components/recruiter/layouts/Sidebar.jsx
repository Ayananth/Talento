import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUnread } from "@/context/UnreadContext";
import { getRecruiterUnreadNotificationsCount } from "@/apis/recruiter/apis";


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalUnread, unreadNotificationsCount, setUnreadNotificationsCount } = useUnread();

  useEffect(() => {
    let isMounted = true;

    const refreshUnreadNotifications = async () => {
      try {
        const count = await getRecruiterUnreadNotificationsCount();
        if (isMounted) {
          setUnreadNotificationsCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch unread notifications count", error);
      }
    };

    refreshUnreadNotifications();
    const intervalId = setInterval(refreshUnreadNotifications, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [location.pathname, setUnreadNotificationsCount]);


  const menuItems = [
    { name: "Dashboard", path: "/recruiter/dashboard" },
    { name: "Profile", path: "/recruiter/profile" },
    { name: "Messages", path: "/recruiter/messages" },
    { name: "Jobs", path: "/recruiter/jobs" },
    { name: "Applications", path: "/recruiter/applications" },
    { name: "Notifications", path: "/recruiter/notifications" },
    // { name: "Settings", path: "/recruiter/settings" },
    // { name: "Logout", path: "/logout" },
  ];

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-white shadow-xl md:shadow-md p-4 transform transition-transform duration-300 z-40
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Menu</h2>

    <ul className="space-y-3">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        const isMessages = item.name === "Messages";
        const isNotifications = item.name === "Notifications";

        return (
          <li key={item.path}>
            <button
              onClick={() => navigate(item.path)}
              className={`w-full text-left flex items-center justify-between px-4 py-2 rounded-lg font-medium transition
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-blue-100"
                }
              `}
            >
              <span>{item.name}</span>

              {/* 🔔 Unread badge */}
              {isMessages && totalUnread > 0 && (
                <span className="bg-red-600 text-white text-xs font-semibold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}

              {isNotifications && unreadNotificationsCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-semibold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                  {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>

    </aside>
  );
};

export default Sidebar;
