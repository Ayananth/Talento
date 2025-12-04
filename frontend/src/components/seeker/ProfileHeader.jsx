import React, { useEffect, useState } from "react";
import { CircleUser } from 'lucide-react';
import api from "../../apis/api";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  Edit3,
  AlertCircle,
} from "lucide-react";

export default function ProfileHeader() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const baseUrl = "https://res.cloudinary.com/dycb8cbf8/"

  const getVal = (val, placeholder) =>
    val && val !== "" && val !== null ? val : placeholder;

  useEffect(() => {
    api
      .get("v1/profile/me")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // Auto hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  // ------------------------ IMAGE UPLOAD HANDLER ------------------------

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(""); // Reset previous error

    // ---- VALIDATIONS ----

    // 1. Check file type (ONLY images)
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only image files (JPEG, PNG, WEBP) are allowed.");
      return;
    }

    // 2. Check size (< 3MB)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      setError("File size must be less than 3MB.");
      return;
    }

    // Show preview
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const res = await api.put("v1/profile/me/profile-image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update UI with new image
      setData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          profile_image: res.data.profile_image,
        },
      }));

      setUploading(false);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  // ------------------------ UI STATES ------------------------

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow p-6 text-center py-8">
        Loading profile...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full bg-white rounded-2xl shadow p-6 text-center py-8 text-red-500">
        Failed to load profile.
      </div>
    );
  }

  const user = data.user || {};
  const profile = data.profile || {};
  const exp = data.experience?.[0] || {};

  // ------------------------ MAIN UI ------------------------

  return (
    <div className="w-full bg-white rounded-2xl shadow p-6">

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* TOP ROW */}
      <div className="flex flex-col lg:flex-row justify-between gap-8">

        {/* LEFT BLOCK */}
        <div className="flex gap-6 w-full lg:w-2/3">

          {/* PROFILE IMAGE + upload */}
          <div className="relative w-35 h-35 flex items-center justify-center">
            <div className="w-30 h-30 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              <img
                src={
                  preview
                    ? preview
                    : baseUrl+profile.profile_image
                    ? baseUrl+profile.profile_image
                    : "https://via.placeholder.com/150?text=Profile"
                }
                alt=""
                className={`w-full h-full object-cover rounded-full ${
                  uploading ? "opacity-70" : ""
                }`}
              />
            </div>

            {/* Upload button */}
            <div className="absolute bottom-0 bg-white shadow rounded-full px-3 py-1 text-xs text-blue-600 font-semibold cursor-pointer">
              <label htmlFor="profileUpload" className="cursor-pointer">
                {uploading ? "Uploading..." : "Edit"}
              </label>
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* USER INFO */}
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {getVal(profile.fullname, "User")}
              </h1>
              <Edit3 size={18} className="text-gray-500" />
            </div>

            <p className="text-sm text-gray-700">
              {getVal(profile.headline, "Role")}
            </p>

            <p className="text-xs text-gray-500">
              at {getVal(exp.company, "Company")}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Profile last updated —
              <span className="text-blue-600 font-medium">
                {" "}
                {profile.last_updated
                  ? new Date(profile.last_updated).toDateString()
                  : "N/A"}
              </span>
            </p>

            <div className="h-px bg-gray-300 my-3"></div>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-800">
              <InfoItem icon={<MapPin size={14} />} text={getVal(profile.address, "Location")} />
              <InfoItem icon={<Briefcase size={14} />} text={profile.experience_years ? `${profile.experience_years} Years` : "Experience"} />
              <InfoItem icon={<Briefcase size={14} />} text={getVal(profile.current_salary, "Salary")} />
              <InfoItem icon={<Phone size={14} />} text={getVal(profile.phone_number, "Phone")} />
              <InfoItem icon={<Mail size={14} />} text={getVal(user.email, "Email")} />
              <InfoItem icon={<Clock size={14} />} text={getVal(profile.notice_period, "Notice Period")} />
            </div>
          </div>
        </div>

        {/* RIGHT STATS BOX */}
        <div className="bg-[#f5f9ff] border border-[#e0eaff] rounded-xl p-6 flex justify-around w-fit lg:w-1/3">
          <StatBox number="0" label="Search Appearances" />
          <div className="w-px h-12 bg-gray-300"></div>
          <StatBox number="0" label="Recruiter Actions" />
        </div>
      </div>
    </div>
  );
}

// ------------------------ SMALL COMPONENTS ------------------------

function InfoItem({ icon, text }) {
  return (
    <div className="flex gap-2 items-start">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatBox({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900">{number}</p>
      <p className="text-gray-600 text-sm">{label}</p>
      <button className="text-blue-600 text-xs mt-1 hover:underline">
        View all
      </button>
    </div>
  );
}
