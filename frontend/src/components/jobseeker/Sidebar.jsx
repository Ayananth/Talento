import React from "react";
import {
  User,
  Briefcase,
  Bookmark,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  FileText,
  Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const baseMenuItems = [
  { name: "My Profile", icon: <User size={18} />, path: "/profile" },
  { name: "Applied Jobs", icon: <Briefcase size={18} />, path: "/profile/applied-jobs" },
  { name: "Saved Jobs", icon: <Bookmark size={18} />, path: "/profile/saved-jobs" },
  { name: "Messages", icon: <MessageSquare size={18} />, path: "/messages" },
  { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  // { name: "Logout", icon: <LogOut size={18} />, path: "/logout" },
];

const premiumMenuItems = [
  {
    name: "AI Job Matches",
    icon: <Sparkles size={18} />,
    path: "/profile/ai-jobs",
    isPremium: true,
  },
  {
    name: "Resume Analyzer",
    icon: <FileText size={18} />,
    path: "/profile/resume-analyzer",
    isPremium: true,
  },
];;

export default function Sidebar({subscription}) {
  const navigate = useNavigate();
  console.log(subscription)
  const menuItems = subscription?.is_active
    ? [...baseMenuItems, ...premiumMenuItems]
    : baseMenuItems;

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

        {item.isPremium && (
          <Crown
            size={16}
            className="text-yellow-500"
            title="Pro feature"
          />
        )}
          </button>
        ))}
      </nav>
    </div>
  );
}
