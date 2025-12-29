import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import JobHeader from "../../components/jobseeker/jobs/jobdetails/JobHeader";
import JobOverview from "../../components/jobseeker/jobs/jobdetails/JobOverview";
import CompanyInfoCard from "../../components/jobseeker/jobs/jobdetails/CompanyInfoCard";
import SimilarJobs from "../../components/jobseeker/jobs/jobdetails/SimilarJobs";
import JobDescription from "../../components/jobseeker/jobs/jobdetails/JobDescription";
import JobActions from "../../components/jobseeker/jobs/jobdetails/JobActions";

import { getJobDetail } from "@/apis/jobseeker/apis";
import { getCloudinaryUrl } from "@/utils/common/getCloudinaryUrl";

export default function JobDetailPage() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ----------------------------------
     Fetch job detail
  ---------------------------------- */
  useEffect(() => {
    // Scroll to top when job changes
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await getJobDetail(id);
        setJob(res);
              } catch (err) {
        console.error("Failed to fetch job detail", err);
        setError(true);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  /* ----------------------------------
     States
  ---------------------------------- */
  if (loading) {
    return (
      <section className="py-16 text-center text-gray-500">
        Loading job details…
      </section>
    );
  }

  if (error || !job) {
    return (
      <section className="py-16 text-center text-gray-500">
        Job not found or unavailable.
      </section>
    );
  }

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <main className="lg:col-span-8 space-y-8">
            <JobHeader
              title={job.title}
              companyName={job.company_name}
              logo={job.logo ? getCloudinaryUrl(job.logo) : null}
              jobType={job.job_type}
              workMode={job.work_mode}
              publishedAt={job.published_at}
            />

            <JobOverview
              jobType={job.job_type}
              workMode={job.work_mode}
              experienceLevel={job.experience_level}
              salaryMin={job.salary_min}
              salaryMax={job.salary_max}
              salaryCurrency={job.salary_currency}
              publishedAt={job.published_at}
              locationCity={job.location_city}
              locationState={job.location_state}
              locationCountry={job.location_country}
            />

            <JobDescription
              description={job.description}
              skills={job.skills}
            />

            <JobActions
              jobId={job.id}
              isActive={true}
              status="published"
              hasApplied={job.has_applied}
              isSaved={false}
            />
          </main>

          {/* RIGHT */}
          <aside className="lg:col-span-4 space-y-8">
            <CompanyInfoCard
              companyName={job.company_name}
              companyAbout={job.company_about}
              companySize={job.company_size}
              companyWebsite={job.company_website}
              logo={job.logo ? getCloudinaryUrl(job.logo) : null}

              /* placeholders for now */
              industry="Software Development"
              location="India"
              foundedYear="2020"
              email="contact@company.com"
              phone="+91 98765 43210"
              openJobs={3}
            />

            <SimilarJobs jobId={job.id} />
          </aside>
        </div>
      </div>
    </section>
  );
}
