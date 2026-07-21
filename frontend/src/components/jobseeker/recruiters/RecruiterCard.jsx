import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import company_placeholder from '../../../assets/common/image.png' 


export default function RecruiterCard({ recruiter }) {
  const navigate = useNavigate();

  const handleViewJobs = () => {
    if (!recruiter?.id) return;

    const params = new URLSearchParams({
      recruiter_id: String(recruiter.id),
    });

    if (recruiter.company_name) {
      params.set("company", recruiter.company_name);
    }

    navigate(`/jobsearch?${params.toString()}`);
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleViewJobs}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleViewJobs();
        }
      }}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

      {/* Logo & Name */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={recruiter.logo || company_placeholder}
            // alt={recruiter.company_name}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-md"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {recruiter.company_name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Hiring Company</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-slate-600 mb-3"
      >
        <MapPin size={16} className="text-blue-500 flex-shrink-0" />
        <span className="truncate">{recruiter.location || "India"}</span>
      </motion.div>

      {/* Jobs Count */}
      <motion.div
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm mb-4 p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors"
      >
        <Briefcase size={16} className="text-blue-600 flex-shrink-0" />
        <div>
          <span className="font-bold text-blue-600">{recruiter.job_count}</span>
          <span className="text-slate-600 ml-1">Jobs Posted</span>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ x: 4 }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-sm group-hover:shadow-lg transition-shadow"
      >
        View Jobs
        <ArrowRight size={16} />
      </motion.div>
    </motion.div>
  );
}


