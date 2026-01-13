import { motion } from "framer-motion";
import { Briefcase, Users, TrendingUp, CheckCircle } from "lucide-react";
import React from "react";
import heroImg1 from "@/assets/jobseeker/hero-1.png";
import heroImg2 from "@/assets/jobseeker/hero-2.png";

import SearchBox from "../../components/jobseeker/home/SearchBox";
import JobsOfTheDay from "../../components/jobseeker/jobs/JobsOfTheDay";
import TopRecruiters from "../../components/jobseeker/recruiters/TopRecruiters";

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

export default function JobseekerLandingPage() {
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "50K+" },
    { icon: Users, label: "Companies", value: "10K+" },
    { icon: TrendingUp, label: "Success Rate", value: "95%" },
    { icon: CheckCircle, label: "Placements", value: "100K+" },
  ];

  const popularSearches = ["Designer", "Web", "iOS", "Developer", "PHP", "Senior", "Engineer"];

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight"
                >
                  The <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Easiest Way</span>
                  <br /> to Get Your <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Dream Job</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed"
                >
                  Each month, more than 3 million job seekers turn to our platform, making over 140,000 applications every single day.
                </motion.p>
              </div>

              {/* SEARCH BOX */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <SearchBox />
              </motion.div>

              {/* POPULAR SEARCHES */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-2 text-sm"
              >
                <span className="text-slate-600 font-medium">Popular Searches:</span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <motion.button
                      key={item}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT IMAGES */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block h-96"
            >
              {/* IMAGE 1 */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -15, 0],
                }}
                transition={{
                  opacity: { duration: 0.7 },
                  x: { duration: 0.7 },
                  y: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute right-0 top-0 rounded-3xl overflow-hidden shadow-2xl w-72 h-80"
              >
                <img
                  src={heroImg1}
                  alt="Team success"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* IMAGE 2 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, 15, 0],
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.2 },
                  x: { duration: 0.8, delay: 0.2 },
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute left-0 bottom-0 rounded-3xl overflow-hidden shadow-2xl w-72 h-80 border-8 border-blue-600"
              >
                <img
                  src={heroImg2}
                  alt="Hiring discussion"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-16 bg-white border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-3 mx-auto"
                  >
                    <Icon size={24} />
                  </motion.div>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* TOP RECRUITERS SECTION */}
      <TopRecruiters />

      {/* JOBS OF THE DAY SECTION */}
      <JobsOfTheDay />
    </>
  );
}