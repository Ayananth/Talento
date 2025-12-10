import React from 'react'
import { Menu, X } from "lucide-react";


const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  return (

      <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between text-gray-800 border-b border-gray-200">
        <h1 className="text-2xl font-semibold tracking-wide">Talento Admin</h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="hover:text-blue-600 transition">Profile</button>
          <button className="hover:text-blue-600 transition">Logout</button>
        </div>
      </nav>
      

  )
}

export default Navbar
