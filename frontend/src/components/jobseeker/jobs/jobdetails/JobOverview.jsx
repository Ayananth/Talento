import {
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Layers,
  Timer,
  CalendarClock,
} from "lucide-react";

const prettify = (value) =>
  value ? value.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) : "—";

const formatSalary = (min, max, currency) => {
  if (!min || !max) return "Not disclosed";
  return `${currency} ${min.toLocaleString()} – ${max.toLocaleString()}`;
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "—";

const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function JobOverview({
  jobType,
  workMode,
  experienceLevel,
  experience,
  salaryMin,
  salaryMax,
  salaryCurrency,
  publishedAt,
  applicationDeadline,
  locationCity,
  locationState,
  locationCountry,
}) {
  const location = [locationCity, locationState, locationCountry]
    .filter(Boolean)
    .join(", ") || "Remote / Not specified";

  const items = [
    {
      icon: <Layers size={18} />,
      label: "Job Type",
      value: prettify(jobType),
    },
    {
      icon: <User size={18} />,
      label: "Experience Level",
      value: prettify(experienceLevel),
    },
    {
      icon: <Timer size={18} />,
      label: "Experience (Years)",
      value: experience ?? "Not specified",
    },
    {
      icon: <DollarSign size={18} />,
      label: "Salary",
      value: formatSalary(salaryMin, salaryMax, salaryCurrency),
    },
    {
      icon: <Briefcase size={18} />,
      label: "Work Mode",
      value: prettify(workMode),
    },
    {
      icon: <Calendar size={18} />,
      label: "Posted On",
      value: formatDate(publishedAt),
    },
    {
      icon: <CalendarClock size={18} />,
      label: "Application Deadline",
      value: formatDateTime(applicationDeadline),
    },
    {
      icon: <MapPin size={18} />,
      label: "Location",
      value: location,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="mt-1 text-blue-600">
              {item.icon}
            </div>

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
