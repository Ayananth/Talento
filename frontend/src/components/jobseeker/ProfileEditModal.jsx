import React, { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";
import api from "../../apis/api";

export default function ProfileEditModal({ isOpen, onClose, initialData, onSuccess }) {
  const [form, setForm] = useState({
    fullname: "",
    headline: "",
    address: "",
    current_salary: "",
    experience_years: "",
    notice_period: "",
    phone_number: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        fullname: initialData?.fullname ?? "",
        headline: initialData?.headline ?? "",
        address: initialData?.address ?? "",
        current_salary: initialData?.current_salary ?? "",
        experience_years: initialData?.experience_years ?? "",
        notice_period: initialData?.notice_period ?? "",
        phone_number: initialData?.phone_number ?? "",
        email: initialData?.email ?? "",
      });
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErr = {};

    if (!form.fullname.trim()) newErr.fullname = "Fullname is required";
    if (!form.headline.trim()) newErr.headline = "Headline is required";
    if (!form.address.trim()) newErr.address = "Address is required";

    if (form.current_salary && !/^\d+$/.test(form.current_salary))
      newErr.current_salary = "Salary must be numeric";

    if (!/^\d+$/.test(form.experience_years))
      newErr.experience_years = "Experience must be numeric";

    if (!form.notice_period.trim())
      newErr.notice_period = "Notice period required";

    if (!/^[0-9]{10}$/.test(form.phone_number))
      newErr.phone_number = "Phone number must be 10 digits";

    if (!/\S+@\S+\.\S+/.test(form.email))
      newErr.email = "Invalid email";

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await api.patch("/v1/profile/me/update/", form);
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }

    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">

        <button className="absolute right-4 top-4 text-gray-600" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <div className="grid grid-cols-1 gap-4">
          {[
            "fullname",
            "headline",
            "address",
            "current_salary",
            "experience_years",
            "notice_period",
            "phone_number",
            "email",
          ].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium capitalize">
                {field.replace("_", " ")}
              </label>

              <input
                type="text"
                className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />

              {errors[field] && (
                <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle size={14} />
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6 hover:bg-blue-700"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}
