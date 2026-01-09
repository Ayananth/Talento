import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/recruiter/dashboard" },
    { name: "Profile", path: "/recruiter/profile" },
    { name: "Messages", path: "/recruiter/messages" },
    { name: "Jobs", path: "/recruiter/jobs" },
    { name: "Applications", path: "/recruiter/applications" },
    { name: "Shortlisted", path: "/recruiter/shortlisted" },
    { name: "Settings", path: "/recruiter/settings" },
    { name: "Logout", path: "/logout" },
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

          return (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full text-left block px-4 py-2 rounded-lg font-medium transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-blue-100"
                  }
                `}
              >
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
