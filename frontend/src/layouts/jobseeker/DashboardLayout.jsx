import React from "react";
import { Navbar } from "../../components/common/Navbar";
import ProfileHeader from '@/components/jobseeker/ProfileHeader'
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/jobseeker/Sidebar"



const DashboardLayout = () => {
  return (
    <div>
      <Navbar/>
      <div className="pt-[100px] bg-gray-50 min-h-screen" style={{ marginTop: "20px" }}>

        <div className="max-w-7xl mx-auto px-4">

          {/* PROFILE HEADER */}
          <ProfileHeader className="mt-96" />

          {/* MAIN LAYOUT */}
          <div className="flex gap-6 mt-6">
            
            {/* SIDEBAR */}
            <div className="w-64">
              <Sidebar />
            </div>

            {/* RIGHT SIDE CONTENT */}
            <Outlet/>


          </div>
        </div>
      </div>
      
    </div>
  )
}

export default DashboardLayout
