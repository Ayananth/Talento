import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  Edit3
} from "lucide-react";

export default function ProfileHeader() {

  



  return (
    <div className="w-full bg-white rounded-2xl shadow p-6">

      {/* TOP ROW */}
      <div className="flex flex-col lg:flex-row justify-between gap-8">

        {/* LEFT BLOCK */}
        <div className="flex gap-6 w-full lg:w-2/3">

          {/* PROFILE RING */}
          <div className="relative w-28 h-28 flex items-center justify-center">


            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              profile
            </div>

          </div>

          {/* USER INFO */}
          <div className="flex flex-col w-full">

            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">ayananth</h1>
              <Edit3 size={18} className="text-gray-500" />
            </div>

            <p className="text-sm text-gray-700">Software Engineer</p>
            <p className="text-xs text-gray-500">at Travancore Analytics</p>

            <p className="text-sm text-gray-500 mt-2">
              Profile last updated — <span className="text-blue-600 font-medium">Today</span>
            </p>

            <div className="h-px bg-gray-300 my-3"></div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-800">

              <InfoItem icon={<MapPin size={14} />} text="Thiruvananthapuram, India" />

              <InfoItem icon={<Briefcase size={14} />} text="3 Years 6 Months" />

              <InfoItem icon={<Briefcase size={14} />} text="₹ 4,20,000" />

              <InfoItem icon={<Phone size={14} />} text="9544670122 ✓" />

              <InfoItem icon={<Mail size={14} />} text="ayananthkris92@gmail.com ✓" />

              <InfoItem icon={<Clock size={14} />} text="15 Days or less notice period" />
            </div>

          </div>
        </div>

        {/* RIGHT STATS BOX */}
        <div className="bg-[#f5f9ff] border border-[#e0eaff] rounded-xl p-6 flex justify-around w-fit lg:w-1/3">

          {/* Search Appearances */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              41<span className="text-red-500 ml-1">•</span>
            </p>
            <p className="text-gray-600 text-sm">Search Appearances</p>
            <button className="text-blue-600 text-xs mt-1 hover:underline">View all</button>
          </div>

          <div className="w-px h-12 bg-gray-300"></div>

          {/* Recruiter Actions */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">7</p>
            <p className="text-gray-600 text-sm">Recruiter Actions</p>
            <button className="text-blue-600 text-xs mt-1 hover:underline">View all</button>
          </div>

        </div>

      </div>
    </div>
  );
}

function InfoItem({ icon, text }) {
  return (
    <div className="flex gap-2 items-start">
      {icon}
      <span className="leading-tight">{text}</span>
    </div>
  );
}
