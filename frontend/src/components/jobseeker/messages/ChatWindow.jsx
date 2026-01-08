import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  MoreVertical,
  AlertCircle,
  Check,
  CheckCheck,
  X,
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';

const ChatWindow = ({ chat, onSendMessage, connected }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleBlockClick = () => {
    onBlockRecruiter(chat.id);
    setShowMenu(false);
    setShowBlockConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-white h-screen"
    >
      {/* Header */}
      <div className="border-b border-slate-200 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={chat.companyLogo}
            alt={chat.companyName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {chat.recruiterName}
            </h2>
            <p className="text-sm text-slate-600">{chat.companyName}</p>
            <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 mt-1">
              {chat.jobTitle}
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreVertical size={20} className="text-slate-600" />
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
              >
                <button
                  onClick={() => setShowBlockConfirm(true)}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <AlertCircle size={16} />
                  {chat.isBlocked ? 'Unblock Recruiter' : 'Block Recruiter'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Blocked State */}
      {chat.isBlocked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center gap-3"
        >
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-900">
              You have blocked this recruiter
            </p>
            <p className="text-xs text-red-700 mt-1">
              You won't receive messages from this recruiter until you unblock them.
            </p>
          </div>
        </motion.div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Paperclip size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No messages yet</p>
              <p className="text-slate-500 text-sm mt-1">
                Start a conversation with {chat.recruiterName}
              </p>
            </div>
          </div>
        ) : (
          <>
            {chat.messages.map((message, index) => {
              const showTimestamp =
                index === 0 ||
                chat.messages[index - 1].timestamp !== message.timestamp;

              return (
                <div key={message.id}>
                  {showTimestamp && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center my-4"
                    >
                      <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                        {message.timestamp}
                      </span>
                    </motion.div>
                  )}
                  <MessageBubble message={message} />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Composer */}
      {!chat.isBlocked ? (
        <MessageComposer
  disabled={!connected || chat.isBlocked}
  onSendMessage={(text, attachments) => onSendMessage(text)}
/>

      ) : (
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <p className="text-sm text-slate-600 text-center">
            You cannot send messages to a blocked recruiter
          </p>
        </div>
      )}

      {/* Block Confirmation Modal */}
      <AnimatePresence>
        {showBlockConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowBlockConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-sm mx-4 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {chat.isBlocked ? 'Unblock Recruiter?' : 'Block Recruiter?'}
                </h3>
              </div>

              <p className="text-slate-600 text-sm mb-6">
                {chat.isBlocked
                  ? `You will be able to receive messages from ${chat.recruiterName} again.`
                  : `You won't receive messages from ${chat.recruiterName} until you unblock them.`}
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBlockConfirm(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBlockClick}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    chat.isBlocked
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {chat.isBlocked ? 'Unblock' : 'Block'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatWindow;
