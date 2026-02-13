import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/common/Navbar";
import ProfileHeader from '@/components/jobseeker/ProfileHeader'
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/jobseeker/Sidebar"
import { useSearchParams } from "react-router-dom";
import Toast from "../../components/common/Toast";
import UpgradeBanner from "../../components/jobseeker/UpgradeBanner";
import useAuth from "../../auth/context/useAuth";


const DashboardLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [toastMessage, setToastMessage] = useState(null);

  const { subscription } = useAuth();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setToastMessage("🎉 You have unlocked Pro features!");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("payment");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f8fbff] to-slate-100">
      <Navbar />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
            <ProfileHeader subscription={subscription} />
          </div>

          {!subscription?.is_active && (
            <div className="mb-6">
              <UpgradeBanner />
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-4">

                
              <Sidebar subscription={subscription} />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)]">
                <Outlet />
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
