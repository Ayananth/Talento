import React from "react";
import {
  User,
  Briefcase,
  Bookmark,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const menuItems = [
    { name: "My Profile", icon: <User size={18} />, path: "/profile" },
    { name: "Applied Jobs", icon: <Briefcase size={18} />, path: "/profile/applied-jobs" },
    { name: "Shortlisted Jobs", icon: <Bookmark size={18} />, path: "/shortlisted" },
    { name: "Messages", icon: <MessageSquare size={18} />, path: "/messages" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { name: "Logout", icon: <LogOut size={18} />, path: "/logout" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium text-sm group"
          >
            <span className="text-slate-500 group-hover:text-blue-600 transition-colors duration-200">
              {item.icon}
            </span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
