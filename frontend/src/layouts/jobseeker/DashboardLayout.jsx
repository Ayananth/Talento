import React from "react";
import { Navbar } from "../../components/common/Navbar";
import ProfileHeader from '@/components/jobseeker/ProfileHeader'
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/jobseeker/Sidebar"

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar />
      
      {/* Main Content Container */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header Section */}
          <div className="mb-12 animate-fade-in">
            <ProfileHeader />
          </div>

          {/* Main Dashboard Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 lg:p-10">
                <Outlet />
              </div>
            </main>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
