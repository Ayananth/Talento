import {
  Briefcase,
  Layers,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  User,
} from "lucide-react";

export default function JobOverview({
  industry = "Mechanical / Auto / Automotive, Civil / Construction",
  jobLevel = "Experienced (Non - Manager)",
  salary = "$800 - $1000",
  experience = "1 - 2 years",
  jobType = "Permanent",
  deadline = "10/08/2022",
  updated = "10/07/2022",
  location = "Dallas, Texas Remote Friendly",
}) {
  const items = [
    {
      icon: <Layers size={18} />,
      label: "Industry",
      value: industry,
    },
    {
      icon: <User size={18} />,
      label: "Job level",
      value: jobLevel,
    },
    {
      icon: <DollarSign size={18} />,
      label: "Salary",
      value: salary,
    },
    {
      icon: <Clock size={18} />,
      label: "Experience",
      value: experience,
    },
    {
      icon: <Briefcase size={18} />,
      label: "Job type",
      value: jobType,
    },
    {
      icon: <Calendar size={18} />,
      label: "Deadline",
      value: deadline,
    },
    {
      icon: <Calendar size={18} />,
      label: "Updated",
      value: updated,
    },
    {
      icon: <MapPin size={18} />,
      label: "Location",
      value: location,
    },
  ];

  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      {/* HEADER */}
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        Overview
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            {/* ICON */}
            <div className="text-blue-600 mt-1">
              {item.icon}
            </div>

            {/* TEXT */}
            <div>
              <p className="text-sm text-slate-500">
                {item.label}
              </p>
              <p className="text-sm font-medium text-slate-900">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
