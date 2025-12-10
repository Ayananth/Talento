import React from 'react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>

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
    
    
    
    </>
  )
}

export default Sidebar
