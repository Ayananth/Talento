import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import companyPlaceholder from "@/assets/common/image.png";
import { getJobs } from "@/apis/jobseeker/apis";
import JobCard from "./JobCard";

export default function JobsOfTheDay() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getJobs({
          page: 1,
          ordering: "-published_at",
          pageSize: "8",
          filters: {
            workMode: [],
            jobType: [],
            experience: [],
            postedWithin: "",
            salaryMin: "",
            salaryMax: "",
          },
        });

        const mappedJobs = (res?.results || []).map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company_name,
          logo: job.logo || companyPlaceholder,
          location: [job.location_city, job.location_country]
            .filter(Boolean)
            .join(", "),
          type: (job.job_type || "").replace("_", " "),
          time: job.published_at
            ? new Date(job.published_at).toLocaleDateString()
            : "",
          salary_from: job.salary_min,
          salary_to: job.salary_max,
          salary_currency: job.salary_currency,
          has_applied: job.has_applied,
        }));

        setJobs(mappedJobs);
      } catch (error) {
        console.error("Failed to load latest jobs", error);
        setError("Unable to load latest jobs right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Latest Jobs
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover the latest job opportunities posted today
          </p>
        </motion.div>

        {/* Job Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && (
            <p className="text-sm text-slate-500 col-span-full text-center">
              Loading latest jobs...
            </p>
          )}

          {!loading && error && (
            <p className="text-sm text-rose-500 col-span-full text-center">
              {error}
            </p>
          )}

          {!loading && !error && jobs.length === 0 && (
            <p className="text-sm text-slate-500 col-span-full text-center">
              No jobs available right now.
            </p>
          )}

          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
