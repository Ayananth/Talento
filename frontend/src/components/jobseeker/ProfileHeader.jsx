import React, { useEffect, useState } from "react";
import api from "../../apis/api";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Clock,
  Edit3,
  AlertCircle,
  Crown
} from "lucide-react";
import ProfileEditModal from "./ProfileEditModal";

function AvatarPlaceholder({ size = 128 }) {
  return (
    <div
      className="relative overflow-hidden bg-neutral-secondary-medium rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute w-16 h-16 text-body-subtle"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default function ProfileHeader({subscription}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  const baseUrl = "https://res.cloudinary.com/dycb8cbf8/";

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
    setImageError(false);
  }, [preview, data?.profile?.profile_image]);


  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only image files (JPEG, PNG, WEBP) are allowed.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("File size must be less than 3MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const res = await api.put("v1/profile/me/profile-image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      <div className="bg-white rounded-2xl shadow p-6 text-center">
        Loading profile...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-center text-red-500">
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
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <ProfileEditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialData={initialData}
        onSuccess={(updated) => {
          setData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              ...updated.profile,
            },
          }));
          setSuccess("Profile updated successfully!");
        }}
      />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-6 rounded-lg flex items-center gap-3">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 m-6 rounded-lg flex items-center gap-3">
          <span className="text-lg">✓</span>
          <span>{success}</span>
        </div>
      )}

      <div className="p-8 sm:p-10">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* LEFT SECTION */}
          <div className="flex gap-8 w-full lg:w-2/3">
            {/* PROFILE IMAGE */}
            <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center w-full h-full shadow-md">
                {uploading ? (
                  <AvatarPlaceholder size={140} />
                ) : !imageError && (preview || profile?.profile_image) ? (
                  <img
                    src={preview || `${baseUrl}${profile.profile_image}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <AvatarPlaceholder size={140} />
                )}
              </div>

              <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 shadow-lg rounded-full p-2.5 text-white cursor-pointer transition-all duration-200 transform hover:scale-110">
                <Edit3 size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* USER INFO */}
            <div className="flex flex-col justify-center w-full">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">
                  {getVal(profile.fullname, "User")}
                </h1>
                <button 
                  onClick={() => setShowModal(true)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  title="Edit profile"
                >
                  {/* 👑 PRO STATUS */}
                  <Edit3 size={18} className="text-slate-500 hover:text-blue-600" />
                </button>
{subscription?.is_active && (
  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-semibold w-fit">
    <Crown size={14} className="text-yellow-500" />
    Pro Member · Valid till {formatExpiry(subscription.end_date)}
  </div>
)}
              </div>

              <p className="text-lg text-slate-600 font-medium mb-1">
                {getVal(profile.headline, "Add your professional headline")}
              </p>

              <p className="text-sm text-slate-500 mb-4">
                {getVal(exp.company, "Add your company")}
              </p>

              <div className="h-px bg-slate-200 my-4" />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <InfoItem icon={<MapPin size={16} />} text={getVal(profile.address, "Location")} />
                <InfoItem icon={<Briefcase size={16} />} text={profile.experience_years ? `${profile.experience_years} Years` : "Experience"} />
                <InfoItem icon={<Briefcase size={16} />} text={getVal(profile.current_salary, "Salary")} />
                <InfoItem icon={<Phone size={16} />} text={getVal(profile.phone_number, "Phone")} />
                <InfoItem icon={<Mail size={16} />} text={getVal(user.email, "Email")} />
                <InfoItem icon={<Clock size={16} />} text={getVal(profile.notice_period, "Notice Period")} />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - STATS
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 flex flex-col justify-center gap-8 w-full lg:w-1/3">
            <StatBox number="0" label="Search Appearances" />
            <div className="h-px bg-blue-200" />
            <StatBox number="0" label="Recruiter Actions" />
          </div> */}
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
      <p className="text-2xl font-bold">{number}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

const formatExpiry = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
