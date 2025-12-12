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
import ProfileEditModal from "./ProfileEditModal";

export default function ProfileHeader() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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

  const initialData = {
    fullname: profile.fullname,
    headline: profile.headline,
    company: exp.company,
    address: profile.address,
    current_salary: profile.current_salary,
    experience_years: profile.experience_years,
    notice_period: profile.notice_period,
    phone_number: profile.phone_number,
    email: user.email,
  };
  // ------------------------ MAIN UI ------------------------





  return (
    <div className="w-full bg-white rounded-2xl shadow p-6">

      {/* modal */}
      <ProfileEditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={initialData}
        onSuccess={(updated) => {
          setData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              ...updated.profile
            }
          }));
          setSuccess("Profile updated successfully!");
        }}
      />

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* success message */}

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2">
          ✓ {success}
        </div>
      )}

      {/* TOP ROW */}
      <div className="flex flex-col lg:flex-row justify-between gap-8">

        {/* LEFT BLOCK */}
        <div className="flex gap-6 w-full lg:w-2/3">

{/* PROFILE IMAGE + upload (debug version) */}
<div className="relative" style={{ width: 128, height: 128 }}>
  <div
    className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
    style={{ width: 128, height: 128 }}
  >
    <img
      src={
        // explicit safe fallback: preview OR valid profile.profile_image OR placeholder
        preview ||
        (profile && profile.profile_image
          ? `${baseUrl}${profile.profile_image}`
          : "https://via.placeholder.com/150?text=Profile")
      }
      alt="Profile"
      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "9999px" }}
      className={uploading ? "opacity-70" : ""}
      onError={(e) => {
        console.warn("Profile image failed to load, falling back to placeholder.", {
          preview,
          profile_image: profile?.profile_image,
          constructedUrl: profile?.profile_image ? `${baseUrl}${profile.profile_image}` : null,
        });
        e.currentTarget.src = "https://via.placeholder.com/150?text=Profile";
      }}
      onLoad={() => {
        console.log("Profile image loaded:", {
          preview,
          profile_image: profile?.profile_image,
          constructedUrl: profile?.profile_image ? `${baseUrl}${profile.profile_image}` : null,
          naturalWidth: e?.target?.naturalWidth, // will be undefined in some envs, ignore if so
        });
      }}
    />
  </div>

  {/* Upload button (unchanged) */}
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
              <button onClick={() => setShowModal(true)}>
                <Edit3 size={18} className="text-gray-500" />
              </button>
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
        {/* View all */}
      </button>
    </div>
  );
}
