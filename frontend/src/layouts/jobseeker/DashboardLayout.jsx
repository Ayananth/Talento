import React, {useEffect, useState} from "react";
import { Navbar } from "../../components/common/Navbar";
import ProfileHeader from '@/components/jobseeker/ProfileHeader'
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/jobseeker/Sidebar"
import { useLocation } from 'react-router-dom'
import { useSearchParams } from "react-router-dom";
import Toast from "../../components/common/Toast";
import { getSubscriptionStatus } from "../../apis/common/subscriptions/subscriptions";


const DashboardLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [toastMessage, setToastMessage] = useState(null);

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscriptionStatus()
      .then(setSubscription)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setToastMessage("🎉 You have unlocked Pro features!");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("payment");
      setSearchParams(newParams, { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
      
      {/* Main Content Container */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header Section */}
          <div className="mb-12 animate-fade-in">
            <ProfileHeader subscription={subscription} />
          </div>

          {/* Main Dashboard Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <Sidebar subscription={subscription} />
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
