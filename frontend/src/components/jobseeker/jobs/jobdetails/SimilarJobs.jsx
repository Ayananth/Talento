import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Clock, MapPin } from "lucide-react";

import { getJobs } from "@/apis/jobseeker/apis";

function formatPostedAgo(dateValue) {
  if (!dateValue) return "Recently posted";

  const published = new Date(dateValue).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - published);
  const mins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 60) return `${mins || 1} min${mins === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatSalary(job) {
  if (!job.salary_min && !job.salary_max) return "Not disclosed";
  const currency = job.salary_currency || "";
  if (job.salary_min && job.salary_max) {
    return `${currency} ${job.salary_min} - ${job.salary_max}`;
  }
  if (job.salary_min) return `${currency} ${job.salary_min}+`;
  return `Up to ${currency} ${job.salary_max}`;
}

export default function SimilarJobs({ jobId, recruiterId, companyName }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      if (!recruiterId || !jobId) {
        setJobs([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await getJobs({
          page: 1,
          pageSize: "8",
          recruiterId,
          ordering: "-published_at",
        });

        const sameCompanyJobs = (res?.results || []).filter(
          (job) => String(job.id) !== String(jobId)
        );
        setJobs(sameCompanyJobs.slice(0, 4));
      } catch (err) {
        console.error("Failed to load company jobs", err);
        setError("Unable to load more jobs from this company.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyJobs();
  }, [jobId, recruiterId]);

  const title = useMemo(() => {
    if (companyName) return `More jobs from ${companyName}`;
    return "More jobs from this company";
  }, [companyName]);

  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      {/* HEADER */}
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        {title}
      </h3>

      {/* JOB LIST */}
      <div className="space-y-6">
        {loading && (
          <p className="text-sm text-slate-500">Loading company jobs...</p>
        )}

        {!loading && error && (
          <p className="text-sm text-rose-500">{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-sm text-slate-500">
            No other active jobs from this company right now.
          </p>
        )}

        {!loading && !error && jobs.map((job, index) => (
          <div key={job.id}>
            <div className="flex gap-4">
              {/* LOGO */}
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                {job.logo ? (
                  <img
                    src={job.logo}
                    alt={job.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Logo</span>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-sm font-semibold text-slate-900 leading-snug hover:text-blue-700 transition-colors"
                >
                  {job.title}
                </Link>

                {/* META */}
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Briefcase size={12} />
                    {(job.job_type || "job").replaceAll("_", " ")}
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatPostedAgo(job.published_at)}
                  </div>
                </div>

                {/* SALARY + LOCATION */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold text-blue-600">
                    {formatSalary(job)}
                  </span>

                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin size={12} />
                    {[job.location_city, job.location_country]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            {index < jobs.length - 1 && (
              <hr className="mt-6 border-slate-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
