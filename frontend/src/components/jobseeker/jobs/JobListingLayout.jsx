import { useEffect, useRef, useState } from "react";
import JobCard from "./JobCard";
import { getJobs, getJobResumeSimilarityBatch } from "../../../apis/jobseeker/apis";
import Pagination from "@/components/common/Pagination";
import company_placeholder from '../../../assets/common/image.png' 
import JobFilters from "./JobFilters";

export default function JobListingLayout({ search, trigger, setJobCount, location, ordering, pageSize, page, setPage, filters, setFilters, searchParams,
  salaryDraft, setSalaryDraft, onApplySalary, onResetSalary
 }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchScoresLoading, setMatchScoresLoading] = useState(false);
  // const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const fetchTokenRef = useRef(0);
  // const [ordering, setOrdering] = useState("-published_at");






  const totalPages = Math.ceil(count / pageSize);

  const fetchMatchScores = async (jobIds, fetchToken) => {
    if (!jobIds.length) return;

    try {
      setMatchScoresLoading(true);
      const similarityRes = await getJobResumeSimilarityBatch(jobIds);
      if (fetchTokenRef.current !== fetchToken) return;

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
      setLoading(false);

      const jobIds = mapped.map((job) => job.id);
      if (jobIds.length) {
        void fetchMatchScores(jobIds, fetchToken);
      } else {
        setMatchScoresLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setJobs([]);
      setCount(0);
      setJobCount(0);
      setMatchScoresLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [pageSize, ordering, search, location]);

  useEffect(() => {
    fetchJobs();
  }, [page, trigger, pageSize, ordering, filters]);

  useEffect(() => {
  setPage(1);
}, [trigger, filters]);



  return (
    <section className="bg-white py-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FILTERS */}
          <JobFilters 
          filters={filters}
          setFilters={setFilters}

          salaryDraft={salaryDraft} 
          setSalaryDraft={setSalaryDraft}
           onApplySalary={onApplySalary}
          onResetSalary={onResetSalary}




          />

          {/* JOB LIST */}
          <main className="lg:col-span-9">
            {/* TOOLBAR */}
            {/* <div className="mb-6">
              <div className="h-14 bg-slate-50 rounded-xl"></div>
            </div> */}

            {/* JOB GRID */}
            {loading ? (
              <p className="text-gray-500 text-sm">Loading jobs…</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-500 text-sm">No jobs found</p>
            ) : (
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
    </section>
  );
}
