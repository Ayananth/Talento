import { motion } from "framer-motion";
import RecruiterCard from "./RecruiterCard";
import api from "../../../apis/api"
import { useEffect, useState } from "react";

export default function TopRecruiters() {


  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(()=>{

    const fetchStats = async ()=> {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/v1/jobs/public/stats");
        setRecruiters(res.data || []);
      } catch (err) {
        console.error("Failed to load recruiter stats", err);
        setError("Unable to load recruiters right now.");
      } finally {
        setLoading(false);
      }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {loading && (
            <p className="text-sm text-slate-500 col-span-full text-center">
              Loading top recruiters...
            </p>
          )}

          {!loading && error && (
            <p className="text-sm text-rose-500 col-span-full text-center">
              {error}
            </p>
          )}

          {!loading && !error && recruiters.length === 0 && (
            <p className="text-sm text-slate-500 col-span-full text-center">
              No recruiters available right now.
            </p>
          )}

          {recruiters.map((recruiter, index) => (
            <motion.div
              key={recruiter.id ?? index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <RecruiterCard recruiter={recruiter} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
