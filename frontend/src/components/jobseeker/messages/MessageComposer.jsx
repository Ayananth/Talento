import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X } from 'lucide-react';

const MessageComposer = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    setAttachments([...attachments, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = !message.trim() && attachments.length === 0;

  return (
    <div className="border-t border-slate-200 bg-white p-6">
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-4 space-y-2"
          >
            {attachments.map((attachment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeAttachment(index)}
                  className="ml-3 p-1 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                >
                  <X size={16} className="text-slate-600" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex gap-3 items-end">
        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows="3"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">
            Press Shift + Enter for new line
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          {/* Attach File Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-3 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            title="Attach file"
          >
            <Paperclip size={20} />
          </motion.button>

          {/* Send Button */}
          <motion.button
            whileHover={!isDisabled ? { scale: 1.05 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            onClick={handleSend}
            disabled={isDisabled}
            className={`p-3 rounded-lg transition-all flex items-center justify-center ${
              isDisabled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            }`}
            title="Send message"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip"
      />

      {/* File Type Info */}
      <p className="text-xs text-slate-500 mt-3">
        Supported: PDF, DOC, XLS, PPT, TXT, Images, ZIP (Max 10MB each)
      </p>
    </div>
  );
};

export default MessageComposer;
