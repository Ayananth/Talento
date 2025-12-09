import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top Navbar */}
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

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-white shadow-xl md:shadow-md p-4 transform transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Menu</h2>
          <ul className="space-y-3">
            <li>
              <a className="block px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-gray-800 font-medium transition" href="#">Dashboard</a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 transition" href="#">Companies</a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 transition" href="#">Recruiters</a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 transition" href="#">Job Listings</a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 transition" href="#">Users</a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0">
          <div className="bg-white shadow-lg rounded-xl p-6 min-h-[300px] border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Dashboard</h2>
            <p className="text-gray-600">
              Welcome to the admin panel. Select an option from the sidebar.
            </p>

            {/* Example Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="p-6 bg-blue-100 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-blue-700">Total Companies</h3>
                <p className="text-3xl font-bold mt-2 text-blue-900">120</p>
              </div>

              <div className="p-6 bg-indigo-100 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-indigo-700">Pending Approvals</h3>
                <p className="text-3xl font-bold mt-2 text-indigo-900">8</p>
              </div>

              <div className="p-6 bg-green-100 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-green-700">Active Jobs</h3>
                <p className="text-3xl font-bold mt-2 text-green-900">56</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
