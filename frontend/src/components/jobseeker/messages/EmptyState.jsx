import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowLeft } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white"
    >
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <MessageSquare size={40} className="text-blue-600" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-2xl font-bold text-slate-900 mb-3"
        >
          No Conversation Selected
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-slate-600 mb-8"
        >
          Select a conversation from the list to start messaging with a recruiter about your job application.
        </motion.p>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left"
        >
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">Tips:</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Keep conversations professional and focused on the job</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>You can attach files like resume, portfolio, or documents</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Block recruiters if you no longer wish to communicate</span>
            </li>
          </ul>
        </motion.div>

        {/* Mobile Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 md:hidden flex items-center justify-center gap-2 text-slate-500 text-sm"
        >
          <ArrowLeft size={16} />
          <span>Select a conversation to begin</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
