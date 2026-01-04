import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatList from '../../components/jobseeker/messages/ChatList';
import ChatWindow from '../../components/jobseeker/messages/ChatWindow';
import EmptyState from '../../components/jobseeker/messages/EmptyState';
import { ArrowLeft } from 'lucide-react';

const MessagesPageResponsive = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [chats, setChats] = useState([
    {
      id: 1,
      recruiterName: 'Sarah Johnson',
      companyName: 'Tech Innovations Inc.',
      companyLogo: 'https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80',
      jobTitle: 'Senior React Developer',
      lastMessage: 'Thanks for your interest! We would like to schedule an interview...',
      timestamp: '2 hours ago',
      unreadCount: 2,
      isBlocked: false,
      messages: [
        {
          id: 1,
          sender: 'recruiter',
          text: 'Hi! Thanks for applying to the Senior React Developer position.',
          timestamp: '10:30 AM',
          status: 'read',
        },
        {
          id: 2,
          sender: 'jobseeker',
          text: 'Thank you! I am very interested in this opportunity.',
          timestamp: '10:35 AM',
          status: 'read',
        },
        {
          id: 3,
          sender: 'recruiter',
          text: 'Great! We would like to schedule an interview with you. Are you available next week?',
          timestamp: '10:40 AM',
          status: 'read',
        },
        {
          id: 4,
          sender: 'jobseeker',
          text: 'Yes, I am available. What time works best for you?',
          timestamp: '10:45 AM',
          status: 'delivered',
        },
      ],
    },
    {
      id: 2,
      recruiterName: 'Michael Chen',
      companyName: 'Digital Solutions Ltd.',
      companyLogo: 'https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80',
      jobTitle: 'Full Stack Engineer',
      lastMessage: 'We will get back to you soon with the next steps.',
      timestamp: '1 day ago',
      unreadCount: 0,
      isBlocked: false,
      messages: [
        {
          id: 1,
          sender: 'recruiter',
          text: 'Thank you for your application!',
          timestamp: 'Yesterday 3:20 PM',
          status: 'read',
        },
      ],
    },
    {
      id: 3,
      recruiterName: 'Emma Wilson',
      companyName: 'Creative Agency Co.',
      companyLogo: 'https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80',
      jobTitle: 'UI/UX Designer',
      lastMessage: 'You have been blocked by this recruiter',
      timestamp: '3 days ago',
      unreadCount: 0,
      isBlocked: true,
      messages: [],
    },
  ]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  const handleSendMessage = (messageText, attachments) => {
    if (!selectedChat) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat.id) {
        const newMessage = {
          id: chat.messages.length + 1,
          sender: 'jobseeker',
          text: messageText,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'sent',
          attachments: attachments,
        };

        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageText,
          timestamp: 'now',
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat(updatedChats.find((c) => c.id === selectedChat.id));
  };

  const handleBlockRecruiter = (chatId) => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, isBlocked: !chat.isBlocked };
      }
      return chat;
    });
    setChats(updatedChats);
    setSelectedChat(updatedChats.find((c) => c.id === chatId));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden md:flex w-full max-w-screen-2xl mx-auto">
        {/* Desktop: Chat List */}
        <div className="hidden md:flex md:w-96 flex-col">
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Desktop: Chat Window or Empty State */}
        <div className="hidden md:flex md:flex-1 flex-col items-stretch">
          <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
            {selectedChat ? (
              <ChatWindow
                chat={selectedChat}
                onSendMessage={handleSendMessage}
                onBlockRecruiter={handleBlockRecruiter}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Responsive View */}
      <div className="md:hidden w-full flex flex-col">
        <AnimatePresence mode="wait">
          {showChatList ? (
            <motion.div
              key="chat-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col relative"
            >
              {/* Back Button */}
              <div className="absolute top-4 left-4 z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackToList}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} className="text-slate-600" />
                </motion.button>
              </div>

              {selectedChat && (
                <ChatWindow
                  chat={selectedChat}
                  onSendMessage={handleSendMessage}
                  onBlockRecruiter={handleBlockRecruiter}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessagesPageResponsive;
