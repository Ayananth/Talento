import { Button, TextInput, Select } from "flowbite-react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";

import React from "react";
import heroImg1 from "@/assets/jobseeker/hero-1.png";
import heroImg2 from "@/assets/jobseeker/hero-2.png";

import { popularCitiesInIndia } from "../../utils/common/utils";
import SearchBox from "../../components/jobseeker/home/SearchBox";

import JobCard from "../../components/jobseeker/jobs/JobCard";
import JobCategoryTabs from "../../components/jobseeker/jobs/JobCategoryTabs";
import JobsOfTheDay from "../../components/jobseeker/jobs/JobsOfTheDay";
import TopRecruiters from "../../components/jobseeker/recruiters/TopRecruiters";

export default function JobseekerLandingPage() {
  return (
    <>
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            The <span className="text-blue-600">Easiest Way</span>
            <br /> to Get Your New Job
          </h1>

          <p className="mt-6 text-slate-600 max-w-xl text-lg">
            Each month, more than 3 million job seekers turn to our platform,
            making over 140,000 applications every single day.
          </p>

          {/* SEARCH BOX */}
          <SearchBox/>


          {/* POPULAR SEARCHES */}
          <div className="mt-6 text-sm text-slate-500">
            Popular Searches:{" "}
            {["Designer", "Web", "iOS", "Developer", "PHP", "Senior", "Engineer"].map(
              (item) => (
                <span
                  key={item}
                  className="underline cursor-pointer hover:text-blue-600 ml-1"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </motion.div>

        {/* RIGHT IMAGES */}
        <div className="relative hidden lg:block">
          
          {/* IMAGE 1 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.7 },
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="rounded-3xl overflow-hidden shadow-2xl w-[380px] ml-auto"
          >

            <img
              src={heroImg1}
              alt="Team success"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* IMAGE 2 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{
              opacity: 1,
              y: [0, 12, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.2 },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute -bottom-20 right-24 rounded-3xl overflow-hidden shadow-2xl w-[360px] border-8 border-blue-600"
          >

            <img
              src={heroImg2}
              alt="Hiring discussion"
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
    <section>
        <TopRecruiters/>
    </section>

    <section>
        <JobsOfTheDay/>

    </section>

</>


  );
}