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
    <div className="flex flex-wrap justify-center gap-3 mt-10">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          whileHover={{ y: -2 }}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 rounded-lg text-sm font-medium border transition
            ${
              active === cat
                ? "bg-blue-50 border-blue-600 text-blue-600"
                : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
            }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
}
