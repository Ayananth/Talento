import JobHeader from "../../components/jobseeker/jobs/jobdetails/JobHeader";
import JobOverview from "../../components/jobseeker/jobs/jobdetails/JobOverview";
import CompanyInfoCard from "../../components/jobseeker/jobs/jobdetails/CompanyInfoCard";
import SimilarJobs from "../../components/jobseeker/jobs/jobdetails/SimilarJobs";
import JobDescription from "../../components/jobseeker/jobs/jobdetails/JobDescription";
import JobActions from "../../components/jobseeker/jobs/jobdetails/JobActions";
export default function JobDetailPage() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: JOB DETAIL */}
          <main className="lg:col-span-8 space-y-8">

            {/* JOB HEADER */}

            <JobHeader />


            {/* JOB IMAGE / BANNER */}
            {/* <div className="h-64 bg-slate-100 rounded-2xl" /> */}

            {/* OVERVIEW */}
            <JobOverview/>

            {/* JOB DESCRIPTION */}
            <JobDescription/>

            {/* Job actions */}
            <JobActions/>

          </main>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:col-span-4 space-y-8">

            {/* COMPANY CARD */}
            <CompanyInfoCard/>

            {/* SIMILAR JOBS */}
            <SimilarJobs/>

          </aside>
        </div>
      </div>
    </section>
  );
}
