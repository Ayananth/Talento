import { motion } from "framer-motion";
import RecruiterCard from "./RecruiterCard";
import api from "../../../apis/api"
import { useEffect, useState } from "react";
import company_placeholder from '../../../assets/common/image.png' 





let RECRUITERS = [
  {
    company_name: "LinkedIn",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 68,
    location: "New York, US",
    openJobs: 25,
  },
  {
    company_name: "Adobe",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 42,
    location: "New York, US",
    openJobs: 17,
  },
  {
    company_name: "Dailymotion",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 46,
    location: "New York, US",
    openJobs: 65,
  },
  {
    company_name: "NewSum",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 68,
    location: "New York, US",
    openJobs: 25,
  },
  {
    company_name: "PowerHome",
    logo: "https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 87,
    location: "New York, US",
    job_count: 34,
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

export default function TopRecruiters() {


  const [recruiters, setRecruiters] = useState([]);

  useEffect(()=>{

    const fetchStats = async ()=> {
      let res =await api.get("v1/jobs/public/stats");
      console.log(res)
      setRecruiters(res.data)
    }

    fetchStats();



  }, [])








  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Top Recruiters
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover your next career move with leading companies hiring on our platform
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {recruiters.map((recruiter, index) => (
            <motion.div key={index} variants={itemVariants}>
              <RecruiterCard recruiter={recruiter} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
