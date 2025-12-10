import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Top Navbar */}
      <Navbar 
            sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen} 
      
      />


      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
        
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen} />


        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-0 mt-16 md:mt-0">
          <div className="bg-white shadow-lg rounded-xl p-6 min-h-[300px] border border-gray-200">
            <Outlet/>
          </div>


        </main>
      </div>
    </div>
  );
}


