import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Zap, ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/auth/context/useAuth";
import LoginPromptModal from "@/components/common/LoginPromptModal";

export default function JobCard({ job, searchParams, matchScoreLoading = false }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const isGuest = !isAuthenticated;

  const goToJobDetail = () => {
    navigate(`/jobs/${job.id}?${searchParams?.toString() || ""}`);
  };

  const handleApply = (e) => {
    e.stopPropagation();
    navigate(`/jobs/${job.id}`);
  };

  const handleLockedScoreClick = (e) => {
    e.stopPropagation();
    setLoginPromptOpen(true);
  };

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
      onClick={goToJobDetail}
      className="group relative cursor-pointer bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={job.logo}
            alt={job.company}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-md"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-600 truncate group-hover:text-blue-600 transition-colors">
              {job.company}
            </p>

            <div className="flex items-center text-xs text-slate-500 gap-1 mt-1">
              <MapPin size={12} />
              <span className="truncate">{job.location || "Remote"}</span>
            </div>
          </div>
        </div>

        {/* Badge */}
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="text-xl flex-shrink-0"
        >
          ⚡
        </motion.div>
      </div>

      {/* Job Title */}
      <motion.h3
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1 }}
        title={job.title}
        className="font-semibold text-base text-slate-900 leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors"
      >
        {job.title}
      </motion.h3>

      {isGuest ? (
        <div className="relative mb-3 w-fit group/lock">
          <button
            onClick={handleLockedScoreClick}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 transition hover:bg-amber-100"
          >
            <Lock size={11} />
            Match Score
          </button>

          {/* Tooltip */}
          <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-52 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover/lock:opacity-100">
            Log in to see how well your resume matches this job.
            <span className="absolute -bottom-1 left-5 h-2 w-2 rotate-45 bg-slate-900" />
          </div>
        </div>
      ) : matchScoreLoading ? (
        <div className="mb-3">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 animate-pulse">
            Calculating match score...
          </span>
        </div>
      ) : job.match_percent !== null && job.match_percent !== undefined && (
        <div className="mb-3">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            {Number(job.match_percent).toFixed(2)}% Match
          </span>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
        <span className="capitalize px-2 py-1 bg-slate-100 rounded-md group-hover:bg-blue-100 transition-colors">
          {job.type}
        </span>

        <span className="flex items-center gap-1">
          <Clock size={12} />
          {job.time}
        </span>
      </div>

      {/* Description */}
      {job.description && (
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {job.description}
        </p>
      )}

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 3).map((skill) => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.05 }}
              className="text-xs bg-blue-50 px-2.5 py-1 rounded-md text-blue-600 border border-blue-200 group-hover:bg-blue-100 transition-colors"
            >
              {skill}
            </motion.span>
          ))}

          {job.skills.length > 3 && (
            <span className="text-xs text-slate-500 px-2.5 py-1">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
        {/* Salary */}
        <div className="text-blue-600 font-semibold text-sm">
          {job.salary_from && job.salary_to ? (
            <>
              {job.salary_currency}{" "}
              {job.salary_from.toLocaleString()} –{" "}
              {job.salary_to.toLocaleString()}
            </>
          ) : (
            <span className="text-slate-400 text-xs">Salary not disclosed</span>
          )}
        </div>

        {/* Apply button */}
        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApply}
          disabled={job.has_applied}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            job.has_applied
              ? "bg-slate-100 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg"
          }`}
        >
          {job.has_applied ? "Applied" : "Apply"}
          {!job.has_applied && <ArrowRight size={14} />}
        </motion.button>
      </div>

      <LoginPromptModal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        title="Log in to see your match score"
        message="Create a profile and upload your resume to see how well you match every job — plus AI insights and instant alerts with Talento Pro."
      />
    </motion.div>
  );
}
