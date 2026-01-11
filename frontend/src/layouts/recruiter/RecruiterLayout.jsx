import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Navbar from "@/components/recruiter/layouts/Navbar";
import Sidebar from "@/components/recruiter/layouts/Sidebar";
import { Outlet } from "react-router-dom";
import { getSubscriptionStatus } from "../../apis/common/subscriptions/subscriptions";

export default function RecruiterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    getSubscriptionStatus()
      .then(setSubscription)
      .finally(() => setLoading(false));
  }, []);

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
            <Outlet context={{subscription}}/>
          </div>


        </main>
      </div>
    </div>
  );
}


