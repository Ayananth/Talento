import JobCard from "./JobCard";


const JOBS = [
  {
    company: "LinkedIn",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    location: "New York, US",
    title: "UI / UX Designer fulltime",
    type: "Fulltime",
    time: "4 minutes ago",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet.",
    skills: ["Adobe XD", "Figma", "Photoshop"],
    salary: 500,
    category: "Management",
  },
  {
    company: "Adobe Illustrator",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    location: "New York, US",
    title: "Full Stack Engineer",
    type: "Part time",
    time: "5 minutes ago",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet.",
    skills: ["React", "NodeJS"],
    salary: 800,
    category: "Marketing & Sale",
  },
  {
    company: "Bing Search",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    location: "New York, US",
    title: "Java Software Engineer",
    type: "Fulltime",
    time: "6 minutes ago",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet.",
    skills: ["Python", "AWS", "Photoshop"],
    salary: 250,
    category: "Finance",
  },
  {
    company: "Dailymotion",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    location: "New York, US",
    title: "Frontend Developer",
    type: "Fulltime",
    time: "6 minutes ago",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet.",
    skills: ["Typescript", "Java"],
    salary: 250,
    category: "Content Writer",
  },
  {
    company: "Dailymotion",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    location: "New York, US",
    title: "Frontend Developer",
    type: "Fulltime",
    time: "6 minutes ago",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet.",
    skills: ["Typescript", "Java"],
    salary: 250,
    category: "Content Writer",
  },
];


export default function JobListingLayout() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT SIDEBAR (FILTERS) */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
              {/* 
                FILTER COMPONENTS GO HERE
                - Location filter
                - Industry checkboxes
                - Salary range
                - Job type
              */}
              <div className="space-y-6">
                <div className="h-6 w-32 bg-slate-100 rounded"></div>
                <div className="h-40 bg-slate-50 rounded"></div>
                <div className="h-32 bg-slate-50 rounded"></div>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT (JOBS) */}
          <main className="lg:col-span-9">

            {/* TOP TOOLBAR */}
            <div className="mb-6">
              {/* JobResultsToolbar goes here */}
              <div className="h-14 bg-slate-50 rounded-xl"></div>
            </div>

            {/* JOBS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Job cards */}
              {/* {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              ))} */}
          {JOBS.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-10 flex justify-center">
              <div className="h-10 w-64 bg-slate-100 rounded-lg"></div>
            </div>

          </main>
        </div>
      </div>
    </section>
  );
}
