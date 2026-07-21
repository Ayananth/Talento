import { useEffect, useRef, useState } from "react";
import JobCard from "./JobCard";
import { getJobs, getJobResumeSimilarityBatch } from "../../../apis/jobseeker/apis";
import Pagination from "@/components/common/Pagination";
import company_placeholder from '../../../assets/common/image.png' 
import JobFilters from "./JobFilters";
import { Link } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import useAuth from "@/auth/context/useAuth";

export default function JobListingLayout({ search, trigger, setJobCount, location, ordering, pageSize, page, setPage, filters, setFilters, searchParams,
  salaryDraft, setSalaryDraft, onApplySalary, onResetSalary,
  recruiterId = "", companyName = "", onClearCompanyFilter,
 }) {
  const { isAuthenticated, user } = useAuth();
  const isAuthenticatedJobseeker =
    Boolean(isAuthenticated) && user?.role === "jobseeker";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchScoresLoading, setMatchScoresLoading] = useState(false);
  const [matchScoreNotice, setMatchScoreNotice] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [count, setCount] = useState(0);
  const fetchTokenRef = useRef(0);






  const totalPages = Math.ceil(count / pageSize);

  const fetchMatchScores = async (jobIds, fetchToken) => {
    if (!jobIds.length) return;

    try {
      setMatchScoresLoading(true);
      const similarityRes = await getJobResumeSimilarityBatch(jobIds);
      if (fetchTokenRef.current !== fetchToken) return;

      if (similarityRes?.resume_required) {
        if (similarityRes?.reason === "no_resume") {
          setMatchScoreNotice("Upload your resume to unlock match scores for every job.");
        } else if (similarityRes?.reason === "no_default_resume") {
          setMatchScoreNotice("Set one resume as default to see match scores in job cards.");
        } else if (similarityRes?.reason === "default_resume_not_ready") {
          setMatchScoreNotice("Your default resume is being processed. Match scores will appear once it is ready.");
        } else {
          setMatchScoreNotice("Resume is required to calculate match scores.");
        }
      } else {
        setMatchScoreNotice(null);
      }

      const scoreMap = new Map(
        (similarityRes?.scores || []).map((item) => [
          Number(item.job_id),
          item.match_percent,
        ])
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          match_percent: scoreMap.has(job.id) ? scoreMap.get(job.id) : null,
        }))
      );
    } catch (similarityErr) {
      if (similarityErr?.response?.status !== 404) {
        console.error("Failed to fetch job match scores", similarityErr);
      }
    } finally {
      if (fetchTokenRef.current === fetchToken) {
        setMatchScoresLoading(false);
      }
    }
  };

  const fetchJobs = async () => {
    const fetchToken = Date.now();
    fetchTokenRef.current = fetchToken;

    try {
      setLoading(true);

      const res = await getJobs({
        page,
        ordering,
        search,
          location,
          pageSize,
          filters,
          recruiterId,
      });
      if (fetchTokenRef.current !== fetchToken) return;

      const mapped = res.results.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        logo: job.logo || company_placeholder,
        location: [job.location_city, job.location_country]
          .filter(Boolean)
          .join(", "),
        type: job.job_type.replace("_", " "),
        work_mode: job.work_mode,
        experience_level: job.experience_level,
        time: new Date(job.published_at).toLocaleDateString(),
        salary_from: job.salary_min,
        salary_to: job.salary_max,
        salary_currency: job.salary_currency,
        has_applied: job.has_applied,
        match_percent: null,
      }));

      setJobs(mapped);
      setCount(res.count);
      setJobCount(res.count);
      setMatchScoreNotice(null);
      setLoading(false);

      const jobIds = mapped.map((job) => job.id);
      if (isAuthenticatedJobseeker && jobIds.length) {
        void fetchMatchScores(jobIds, fetchToken);
      } else {
        setMatchScoresLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setJobs([]);
      setCount(0);
      setJobCount(0);
      setMatchScoreNotice(null);
      setMatchScoresLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [pageSize, ordering, search, location, recruiterId]);

  useEffect(() => {
    fetchJobs();
  }, [page, trigger, pageSize, ordering, filters, recruiterId, isAuthenticatedJobseeker]);

  useEffect(() => {
  setPage(1);
}, [trigger, filters, recruiterId]);



  return (
    <section className="bg-white py-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FILTERS */}
          <div className="hidden lg:block lg:col-span-3">
            <JobFilters 
            filters={filters}
            setFilters={setFilters}
            salaryDraft={salaryDraft} 
            setSalaryDraft={setSalaryDraft}
            onApplySalary={onApplySalary}
            onResetSalary={onResetSalary}
            mode="desktop"
            />
          </div>

          {/* JOB LIST */}
          <main className="lg:col-span-9">
            <div className="mb-4 lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>



            {recruiterId && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-800">
                  Jobs at {companyName || "selected company"}
                  {onClearCompanyFilter && (
                    <button
                      type="button"
                      onClick={onClearCompanyFilter}
                      className="rounded-full p-0.5 text-blue-600 hover:bg-blue-100"
                      aria-label="Clear company filter"
                    >
                      <X size={14} />
                    </button>
                  )}
                </span>
              </div>
            )}

            {/* JOB GRID */}
            {loading ? (
              <p className="text-gray-500 text-sm">Loading jobs…</p>
            ) : jobs.length === 0 ? (
              recruiterId ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
                  <p className="text-base font-semibold text-slate-800">
                    No active jobs from {companyName || "this company"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Openings from this company may have expired or been closed.
                    Check back later or browse other roles.
                  </p>
                  {onClearCompanyFilter && (
                    <button
                      type="button"
                      onClick={onClearCompanyFilter}
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Clear company filter
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No jobs found</p>
              )
            ) : (
              <>
                {matchScoreNotice && (
                  <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p>{matchScoreNotice}</p>
                    <Link
                      to="/profile"
                      className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
                    >
                      Upload Resume
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      searchParams={searchParams}
                      matchScoreLoading={matchScoresLoading}
                    />
                  ))}
                </div>
              </>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(num) => setPage(num)}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <JobFilters
              filters={filters}
              setFilters={setFilters}
              salaryDraft={salaryDraft}
              setSalaryDraft={setSalaryDraft}
              onApplySalary={onApplySalary}
              onResetSalary={onResetSalary}
              mode="mobile"
            />

            <div className="mt-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
