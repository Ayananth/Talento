import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatList from '../../components/jobseeker/messages/ChatList';
import ChatWindow from '../../components/jobseeker/messages/ChatWindow';
import EmptyState from '../../components/jobseeker/messages/EmptyState';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
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
    <div className="flex h-screen bg-slate-50">
      {/* Left Padding */}
      <div className="hidden lg:block w-1/6 bg-slate-50"></div>

      {/* Main Chat Container */}
      <div className="flex flex-1 lg:w-2/3">
        {/* Chat List */}
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />

        {/* Chat Window or Empty State */}
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

      {/* Right Padding */}
      <div className="hidden lg:block w-1/6 bg-slate-50"></div>
    </div>
  );
};

export default MessagesPage;
