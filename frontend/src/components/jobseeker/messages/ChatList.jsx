import React from 'react';
import { motion } from 'framer-motion';
import { Search, Lock } from 'lucide-react';

const ChatList = ({ chats, selectedChat, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredChats = chats.filter(
    (chat) =>
      chat.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-screen"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Messages</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center px-4">
            <div>
              <p className="text-slate-500 text-sm">No conversations found</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredChats.map((chat) => (
              <motion.button
                key={chat.id}
                whileHover={{ backgroundColor: 'rgba(15, 23, 42, 0.02)' }}
                onClick={() => onSelectChat(chat)}
                className={`w-full p-4 text-left transition-colors ${
                  selectedChat?.id === chat.id
                    ? 'bg-blue-50 border-l-4 border-blue-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.companyLogo}
                      alt={chat.companyName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {chat.isBlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                        <Lock size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {chat.recruiterName}
                      </h3>
                      <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                        {chat.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-2">{chat.companyName}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600 truncate">
                        {chat.isBlocked ? (
                          <span className="text-red-600 font-medium">
                            You have blocked this recruiter
                          </span>
                        ) : (
                          chat.lastMessage
                        )}
                      </p>

                      {/* Unread Badge */}
                      {chat.unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-2 flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold"
                        >
                          {chat.unreadCount}
                        </motion.div>
                      )}
                    </div>

                    {/* Job Title Tag */}
                    <div className="mt-2">
                      <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                        {chat.jobTitle}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatList;
