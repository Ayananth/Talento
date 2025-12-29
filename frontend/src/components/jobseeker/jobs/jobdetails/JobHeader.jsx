import { Button } from "flowbite-react";
import { Briefcase, Clock, MapPin } from "lucide-react";

const formatJobType = (value) =>
  value ? value.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) : "";

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export default function JobHeader({
  title,
  companyName,
  logo,
  jobType,
  workMode,
  publishedAt,
  onApply = () => {},
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

        {/* LEFT */}
        <div className="flex gap-4">
          {/* LOGO */}
          {/* <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
            {logo ? (
              <img
                src={logo}
                alt={companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 text-sm">Logo</span>
            )}
          </div> */}

          {/* TEXT */}
          <div>
            {/* TITLE */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>

            {/* COMPANY */}
            <p className="mt-1 text-sm font-medium text-slate-600">
              {companyName}
            </p>

            {/* META */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Briefcase size={16} />
                {formatJobType(jobType)}
              </div>

              <div className="flex items-center gap-1 capitalize">
                <MapPin size={16} />
                {workMode}
              </div>

              <div className="flex items-center gap-1">
                <Clock size={16} />
                {timeAgo(publishedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        {/* <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 shrink-0"
          onClick={onApply}
        >
          Apply now
        </Button> */}
      </div>
    </div>
  );
}
