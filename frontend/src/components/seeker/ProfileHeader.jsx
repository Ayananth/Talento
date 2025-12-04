import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  Edit3
} from "lucide-react";

export default function ProfileHeader() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to replace null/undefined with placeholder
  const getValue = (value, placeholder) =>
    value && value !== "" ? value : placeholder;

  useEffect(() => {
    axios
      .get("/api/profile/")
      .then((res) => {
        setProfile(res.data || {});
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  console.log(profile)
  console.log(getValue(profile.job_title, "Role"))

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow p-6 text-center py-10">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl shadow p-6 text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow p-6">

      {/* TOP ROW */}
      <div className="flex flex-col lg:flex-row justify-between gap-8">

        {/* LEFT BLOCK */}
        <div className="flex gap-6 w-full lg:w-2/3">

          {/* PROFILE IMAGE */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              {profile.image ? (
                <img src={profile.image} className="w-full h-full rounded-full object-cover" />
              ) : (
                "profile"
              )}
            </div>

            <div className="absolute bottom-0 bg-white shadow rounded-full px-3 py-1 text-xs text-green-600 font-semibold">
              {getValue(profile.completion, "0%")}
            </div>
          </div>

          {/* USER INFO */}
          <div className="flex flex-col w-full">

            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {getValue(profile.name, "User")}
              </h1>
              <Edit3 size={18} className="text-gray-500" />
            </div>

            <p className="text-sm text-gray-700">
              {getValue(profile.job_title, "Role")}
            </p>

            <p className="text-xs text-gray-500">
              at {getValue(profile.company, "Company")}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Profile last updated —{" "}
              <span className="text-blue-600 font-medium">
                {getValue(profile.updated, "N/A")}
              </span>
            </p>

            <div className="h-px bg-gray-300 my-3"></div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-800">
              <InfoItem
                icon={<MapPin size={14} />}
                text={getValue(profile.location, "Location")}
              />

              <InfoItem
                icon={<Briefcase size={14} />}
                text={getValue(profile.experience, "Experience")}
              />

              <InfoItem
                icon={<Briefcase size={14} />}
                text={getValue(profile.salary, "Salary")}
              />

              <InfoItem
                icon={<Phone size={14} />}
                text={getValue(profile.phone, "Phone")}
              />

              <InfoItem
                icon={<Mail size={14} />}
                text={getValue(profile.email, "Email")}
              />

              <InfoItem
                icon={<Clock size={14} />}
                text={getValue(profile.notice_period, "Notice Period")}
              />
            </div>

          </div>
        </div>

        {/* RIGHT STATS BOX */}
        <div className="bg-[#f5f9ff] border border-[#e0eaff] rounded-xl p-6 flex justify-around w-fit lg:w-1/3">
          <StatBox number={getValue(profile.searches, "0")} label="Search Appearances" />
          <div className="w-px h-12 bg-gray-300"></div>
          <StatBox number={getValue(profile.actions, "0")} label="Recruiter Actions" />
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

function StatBox({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900">{number}</p>
      <p className="text-gray-600 text-sm">{label}</p>
      {/* <button className="text-blue-600 text-xs mt-1 hover:underline">
        View all
      </button> */}
    </div>
  );
}
