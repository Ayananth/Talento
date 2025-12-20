import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function RecruiterCard({ recruiter }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg"
    >
      {/* Logo & Name */}
      <div className="flex items-center gap-4">
        <img
          src={recruiter.logo}
          alt={recruiter.name}
          className="w-12 h-12 rounded-xl object-cover"
        />
        <div>
          <h3 className="font-semibold text-slate-900">
            {recruiter.name}
          </h3>

          {/* Rating */}
          {/* <div className="flex items-center gap-1 text-sm text-slate-500">
            {"★".repeat(5)}
            <span className="ml-1">({recruiter.reviews})</span>
          </div> */}
        </div>
      </div>

      {/* Location */}
      <div className="mt-4 flex items-center gap-1 text-sm text-slate-500">
        <MapPin size={14} />
        {recruiter.location}
      </div>

      {/* Jobs */}
      <div className="mt-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-700">
          {recruiter.openJobs}
        </span>{" "}
        Open Jobs
      </div>
    </motion.div>
  );
}
