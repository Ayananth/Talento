
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle) params.append('title', jobTitle);
    if (location) params.append('location', location);
    navigate(`/jobsearch?${params.toString()}`);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onSubmit={handleSearch}
      className="w-full max-w-2xl"
    >
      <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl shadow-lg p-2 border border-slate-200">
        {/* Job Title Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <Search size={20} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Job title or keyword"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-900 placeholder-slate-400 text-sm"
          />
        </div>

        {/* Location Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-t sm:border-t-0 sm:border-l border-slate-200">
          <MapPin size={20} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="City or location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent outline-none text-slate-900 placeholder-slate-400 text-sm"
          />
        </div>

        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Search size={18} />
          <span className="hidden sm:inline">Search</span>
        </motion.button>
      </div>
    </motion.form>
  );
};

export default SearchBox;
