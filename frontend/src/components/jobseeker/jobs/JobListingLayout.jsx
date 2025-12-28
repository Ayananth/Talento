import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { getJobs } from "../../../apis/jobseeker/apis";
import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE } from "@/constants/constants";
import company_placeholder from '../../../assets/common/image.png' 

export default function JobListingLayout({ search, trigger, setJobCount, location }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState("-created_at");

  const totalPages = Math.ceil(count / PAGE_SIZE);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await getJobs({
        page,
        ordering,
        search,
          location,
      });

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
      }));

      setJobs(mapped);
      setCount(res.count);
      setJobCount(res.count)
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, ordering, trigger]);

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FILTERS */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
              <div className="space-y-6">
                <div className="h-6 w-32 bg-slate-100 rounded"></div>
                <div className="h-40 bg-slate-50 rounded"></div>
                <div className="h-32 bg-slate-50 rounded"></div>
              </div>
            </div>
          </aside>

          {/* JOB LIST */}
          <main className="lg:col-span-9">
            {/* TOOLBAR */}
            <div className="mb-6">
              <div className="h-14 bg-slate-50 rounded-xl"></div>
            </div>

            {/* JOB GRID */}
            {loading ? (
              <p className="text-gray-500 text-sm">Loading jobs…</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-500 text-sm">No jobs found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
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
