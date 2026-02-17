import React from 'react'
import { Menu, X, Bell } from "lucide-react";
import useAuth from '@/auth/context/useAuth';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between text-gray-800 border-b border-gray-200">
      <h1 className="text-2xl font-semibold tracking-wide">Talento Recruiter</h1>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center space-x-6">

        {/* Notification Icon */}
        {/* <button className="relative hover:text-blue-600 transition">
          <Bell size={22} />

          <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
        </button> */}

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="hover:text-blue-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
