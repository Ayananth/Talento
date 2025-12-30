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

export default function ProfileHeader() {
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
    <div className="w-full bg-white rounded-2xl shadow p-6">
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
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-lg mb-4">
          ✓ {success}
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* LEFT */}
        <div className="flex gap-6 w-full lg:w-2/3">
          {/* PROFILE IMAGE */}
          <div className="relative" style={{ width: 128, height: 128 }}>
            <div className="rounded-full overflow-hidden bg-gray-200 flex items-center justify-center w-full h-full">
              {uploading ? (
                <AvatarPlaceholder size={128} />
              ) : !imageError && (preview || profile?.profile_image) ? (
                <img
                  src={preview || `${baseUrl}${profile.profile_image}`}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <AvatarPlaceholder size={128} />
              )}
            </div>

            <label className="absolute bottom-0 bg-white shadow rounded-full px-3 py-1 text-xs text-blue-600 font-semibold cursor-pointer">
              {uploading ? "Uploading..." : "Edit"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
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

            <div className="h-px bg-gray-300 my-3" />

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

        {/* RIGHT */}
        <div className="bg-[#f5f9ff] border border-[#e0eaff] rounded-xl p-6 flex justify-around w-fit lg:w-1/3">
          <StatBox number="0" label="Search Appearances" />
          <div className="w-px h-12 bg-gray-300" />
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
      <p className="text-2xl font-bold">{number}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
