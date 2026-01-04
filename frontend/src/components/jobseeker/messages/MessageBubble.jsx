import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Download, File } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isJobseeker = message.sender === 'jobseeker';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check size={14} className="text-slate-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-slate-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isJobseeker ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md`}>
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isJobseeker
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-slate-100 text-slate-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.text}</p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    isJobseeker
                      ? 'bg-blue-500/30'
                      : 'bg-slate-200'
                  }`}
                >
                  <File size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs opacity-75">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-1 rounded hover:opacity-75 transition-opacity`}
                  >
                    <Download size={14} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp and Status */}
        <div
          className={`flex items-center gap-1 mt-1 text-xs text-slate-500 ${
            isJobseeker ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{message.timestamp}</span>
          {isJobseeker && getStatusIcon(message.status)}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
