import { motion } from "framer-motion";

const categories = [
  "Management",
  "Marketing & Sale",
  "Finance",
  "Human Resource",
  "Retail & Products",
  "Content Writer",
];

export default function JobCategoryTabs({ active, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap justify-center gap-3 mt-10"
    >
      {categories.map((cat, index) => (
        <motion.button
          key={cat}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(cat)}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-300 ${
            active === cat
              ? "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 text-white shadow-lg"
              : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </motion.div>
  );
}
