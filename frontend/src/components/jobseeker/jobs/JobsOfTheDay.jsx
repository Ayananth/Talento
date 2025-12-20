import { useState } from "react";
import JobCard from "./JobCard";
import JobCategoryTabs from "./JobCategoryTabs";

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

export default function JobsOfTheDay() {
  const [activeCategory, setActiveCategory] = useState("Management");

//   const filteredJobs = JOBS.filter(
//     (job) => job.category === activeCategory
//   );

    const filteredJobs = JOBS;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Jobs of the day
          </h1>
          <p className="mt-3 text-slate-500">
            Search and connect with the right candidates faster.
          </p>
        </div>

        {/* Tabs */}
        <JobCategoryTabs
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Job Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredJobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
