import { useState } from "react";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function JobsOfTheDay() {
  const [activeCategory, setActiveCategory] = useState("Management");

  const filteredJobs = JOBS;

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
            Jobs of the Day
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover the latest job opportunities posted today
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <JobCategoryTabs
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </motion.div>

        {/* Job Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredJobs.map((job, index) => (
            <motion.div key={index} variants={itemVariants}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
