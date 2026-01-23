import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
    const { pendingNew, Contextloading } = useAdmin();
  

  const menuItems = [
    { name: "Dashboard", path: "/admin",  },
    { name: "Transactions", path: "/admin/transactions",  },
    { name: "Approvals", path: "/admin/recruiter/approvals",count: pendingNew?.total_pending_recruiters ?? 0, },
    { name: "Job Listings", path: "/admin/jobs" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-white shadow-xl md:shadow-md p-4 transform transition-transform duration-300 z-40
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Menu</h2>

      <ul className="space-y-3">
        {menuItems.map((item) => {
          console.log("location path",location.pathname)
          console.log(item.path)

          console.log("")
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
            <div className="flex items-center justify-between w-full">
              <span>{item.name}</span>

              {!Contextloading && item.count > 0 && (
                <span className="ml-2 min-w-[20px] text-center px-2 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full">
                  {item.count}
                </span>
              )}
            </div>

              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
