import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const goToJobDetail = () => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={goToJobDetail}
      className="cursor-pointer bg-white border border-slate-200 rounded-2xl p-6
                 shadow-sm hover:shadow-lg flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={job.logo}
            alt={job.company}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />

          <div className="min-w-0">
            {/* Company name */}
            <p className="text-sm font-medium text-slate-600 truncate">
              {job.company}
            </p>

            {/* Location */}
            <div className="flex items-center text-xs text-slate-500 gap-1">
              <MapPin size={12} />
              <span className="truncate">
                {job.location || "Remote"}
              </span>
            </div>
          </div>
        </div>

        {/* Optional badge / lightning */}
        <span className="text-green-500 font-bold">⚡</span>
      </div>

      {/* Job Title */}
      <h3
        title={job.title}
        className="mt-4 font-semibold text-base text-slate-900 leading-snug line-clamp-2"
      >
        {job.title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
        <span className="capitalize">
          {job.type} • {job.work_mode}
        </span>

        <span className="flex items-center gap-1">
          <Clock size={12} />
          {job.time}
        </span>
      </div>

      {/* Description */}
      {job.description && (
        <p className="mt-4 text-sm text-slate-600 line-clamp-3">
          {job.description}
        </p>
      )}

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-600"
            >
              {skill}
            </span>
          ))}

          {job.skills.length > 4 && (
            <span className="text-xs text-slate-500">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-6">
        {/* Salary */}
        <div className="text-blue-600 font-semibold text-sm">
          {job.salary_from && job.salary_to ? (
            <>
              {job.salary_currency}{" "}
              {job.salary_from.toLocaleString()} –{" "}
              {job.salary_to.toLocaleString()}
            </>
          ) : (
            <span className="text-slate-400">
              Salary not disclosed
            </span>
          )}
        </div>

        {/* Apply button (DOES NOT trigger navigation) */}
        <Button
          size="sm"
          color="light"
          onClick={(e) => {
            e.stopPropagation(); 
            navigate(`/jobs/${job.id}`);
          }}
        >
          Apply
        </Button>
      </div>
    </motion.div>
  );
}
