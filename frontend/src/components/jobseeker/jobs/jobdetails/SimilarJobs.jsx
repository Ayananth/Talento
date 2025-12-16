import { Briefcase, Clock, MapPin } from "lucide-react";

export default function SimilarJobs({ jobs = [] }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      
      {/* HEADER */}
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Similar jobs
      </h3>

      {/* JOB LIST */}
      <div className="space-y-6">
        {(jobs.length ? jobs : mockJobs).map((job, index) => (
          <div key={index}>
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
                <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                  {job.title}
                </h4>

                {/* META */}
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Briefcase size={12} />
                    {job.type}
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {job.postedAgo}
                  </div>
                </div>

                {/* SALARY + LOCATION */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-semibold text-blue-600">
                    {job.salary}
                  </span>

                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin size={12} />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            {index < (jobs.length ? jobs.length : mockJobs).length - 1 && (
              <hr className="mt-6 border-slate-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* TEMP MOCK DATA */
const mockJobs = [
  {
    title: "UI / UX Designer fulltime",
    type: "Fulltime",
    postedAgo: "3 mins ago",
    salary: "$250 / Hour",
    location: "New York, US",
    logo: "/logos/linkedin.png",
  },
  {
    title: "Java Software Engineer",
    type: "Fulltime",
    postedAgo: "5 mins ago",
    salary: "$500 / Hour",
    location: "Tokyo, Japan",
    logo: "/logos/labyrinth.png",
  },
  {
    title: "Frontend Developer",
    type: "Fulltime",
    postedAgo: "8 mins ago",
    salary: "$350 / Hour",
    location: "Remote",
    logo: "/logos/bing.png",
  },
];
