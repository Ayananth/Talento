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
  const completionFields = [
    profile.fullname,
    profile.headline,
    // exp.company,
    profile.address,
    profile.experience_years,
    profile.current_salary,
    profile.notice_period,
    profile.phone_number,
    user.email,
    profile.profile_image,
  ];
  const completedCount = completionFields.filter(
    (field) => field !== null && field !== undefined && String(field).trim() !== ""
  ).length;
  const completionPercent = Math.round((completedCount / completionFields.length) * 100);

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
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.5)]">
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

      <div className="relative">
        <div className="h-20 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
        <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_55%)]" />

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.6)]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="relative flex-shrink-0" style={{ width: 122, height: 122 }}>
                  <div className="h-full w-full overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 shadow-md ring-1 ring-slate-200">
                    {uploading ? (
                      <AvatarPlaceholder size={122} />
                    ) : !imageError && (preview || profile?.profile_image) ? (
                      <img
                        src={preview || `${baseUrl}${profile.profile_image}`}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <AvatarPlaceholder size={122} />
                    )}
                  </div>

                  <label className="absolute -bottom-1 -right-1 inline-flex cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 p-2 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700">
                    <Edit3 size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {getVal(profile.fullname, "User")}
                    </h1>
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      title="Edit profile"
                    >
                      <Edit3 size={14} />
                      Edit Profile
                    </button>
                  </div>

                  <p className="mt-2 text-base font-medium text-slate-700 sm:text-lg">
                    {getVal(profile.headline, "Add your professional headline")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Currently at {getVal(exp.company, "Add your company")}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <InfoChip
                      icon={<MapPin size={14} />}
                      text={getVal(profile.address, "Add location")}
                    />
                    <InfoChip
                      icon={<Briefcase size={14} />}
                      text={
                        profile.experience_years
                          ? `${profile.experience_years} years experience`
                          : "Add experience"
                      }
                    />
                    <InfoChip
                      icon={<Clock size={14} />}
                      text={getVal(profile.notice_period, "Add notice period")}
                    />
                    {subscription?.is_active && (
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800">
                        <Crown size={13} className="text-yellow-600" />
                        Pro until {formatExpiry(subscription.end_date)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoItem icon={<Mail size={16} />} label="Email" text={getVal(user.email, "Add email")} />
                <InfoItem icon={<Phone size={16} />} label="Phone" text={getVal(profile.phone_number, "Add phone")} />
                <InfoItem icon={<Briefcase size={16} />} label="Current Salary" text={getVal(profile.current_salary, "Add salary")} />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 via-white to-white p-5 shadow-[0_20px_35px_-30px_rgba(37,99,235,0.6)]">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Profile completeness
              </p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-3xl font-bold text-slate-900">{completionPercent}%</p>
                <p className="text-xs text-slate-500">
                  {completedCount}/{completionFields.length} fields complete
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              <p className="mt-4 text-sm text-slate-600">
                {completionPercent >= 80
                  ? "Great profile quality. Keep it updated weekly."
                  : "Complete missing details to improve recruiter visibility."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------ SMALL COMPONENTS ------------------------

function InfoItem({ icon, label, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        <span className="text-slate-400">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="truncate text-sm font-medium text-slate-700">{text}</p>
    </div>
  );
}

function InfoChip({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
      <span className="text-slate-500">{icon}</span>
      <span>{text}</span>
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
