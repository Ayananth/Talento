import React from "react";

export default function AdminDashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Talento Admin</h1>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-600">Profile</button>
          <button className="text-gray-600 hover:text-blue-600">Logout</button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
          <ul className="space-y-3">
            <li>
              <a
                className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700"
                href="#"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700"
                href="#"
              >
                Companies
              </a>
            </li>
            <li>
              <a
                className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700"
                href="#"
              >
                Recruiters
              </a>
            </li>
            <li>
              <a
                className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700"
                href="#"
              >
                Job Listings
              </a>
            </li>
            <li>
              <a
                className="block px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700"
                href="#"
              >
                Users
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white shadow-md rounded-xl p-6 min-h-[300px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Dashboard</h2>
            <p className="text-gray-600">
              Welcome to the admin panel. Choose an option from the left sidebar to begin.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
