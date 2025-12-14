import React from "react";
import {
  User,
  Briefcase,
  Bookmark,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "My Profile", icon: <User size={18} />, path: "/profile" },
    { name: "Applied Jobs", icon: <Briefcase size={18} />, path: "/applied" },
    { name: "Shortlisted Jobs", icon: <Bookmark size={18} />, path: "/shortlisted" },
    { name: "Messages", icon: <MessageSquare size={18} />, path: "/messages" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { name: "Logout", icon: <LogOut size={18} />, path: "/logout" }
  ];

  return (
    <div className="w-64 min-h-screen border border-gray-300 bg-white p-6 mt-10">
      <nav className="flex flex-col gap-8 mt-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-4 text-gray-600 hover:text-black cursor-pointer transition"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
