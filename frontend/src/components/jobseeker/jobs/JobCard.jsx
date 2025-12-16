import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { Button } from "flowbite-react";

export default function JobCard({ job }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={job.logo}
            alt={job.company}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-semibold text-slate-800">
              {job.company}
            </h4>
            <div className="flex items-center text-sm text-slate-500 gap-1">
              <MapPin size={14} />
              {job.location}
            </div>
          </div>
        </div>

        <span className="text-green-500 font-bold">⚡</span>
      </div>

      {/* Title */}
      <h3 className="mt-4 font-semibold text-lg text-slate-900">
        {job.title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
        <span>{job.type}</span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {job.time}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-slate-600 line-clamp-3">
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="text-xs bg-slate-100 px-3 py-1 rounded-md text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-6">
        <div className="text-blue-600 font-bold text-lg">
          ${job.salary}
          <span className="text-sm font-medium text-slate-500">/Hour</span>
        </div>

        <Button size="sm" color="light">
          Apply Now
        </Button>
      </div>
    </motion.div>
  );
}
