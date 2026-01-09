import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import ChatList from "../../components/jobseeker/messages/ChatList";
import ChatWindow from "../../components/jobseeker/messages/ChatWindow";
import EmptyState from "../../components/jobseeker/messages/EmptyState";
import { fetchConversations } from "../../apis/common/fetchConversations";
import { fetchConversationMessages } from "../../apis/common/fetchConversationMessages";
 import useAuth from "@/auth/context/useAuth";
 import { getAccessToken } from "../../auth/context/authUtils";
 import useChatSocket from "../../hooks/useChatSocket";

const MessagesPageResponsive = () => {
  // --------------------
  // STATE
  // --------------------
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const { user } = useAuth();
  // console.log("User in MessagesPageResponsive:", user);
  const currentUserId = Number(user?.user_id);

  const accessToken  = getAccessToken();

  const { connected, sendMessage } = useChatSocket({
    conversationId: selectedChat?.id,
    token: accessToken,
    onMessage: (msg) => {
      setMessages((prev) => [...prev, {
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.sender_name,
        text: msg.content,
        timestamp: new Date(msg.created_at).toLocaleString(),
      }]);
    },
  });



const handleSendMessage = (text) => {
  console.log("Send message:", text);
  sendMessage(text);
};


  // --------------------
  // LOAD CONVERSATIONS
  // --------------------
  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      try {
        const data = await fetchConversations();

        /**
         * Normalize backend response → UI model
         * This protects the UI from backend changes
         */
        const normalized = data.map((c) => ({
          id: c.id,

          // Person / company we are chatting with
          name: c.other_user?.name ?? "Unknown",

          // Job title (if backend provided it)
          jobTitle: c.other_user?.job ?? "Job",

          // Message preview
          lastMessage: c.last_message ?? "No messages yet",

          // Timestamp (safe formatting)
          timestamp: c.last_message_time
            ? new Date(c.last_message_time).toLocaleString()
            : "",

          // Optional fields (future-ready)
          unreadCount: 0,
          isBlocked: false,
          companyName: null,
          companyLogo: null,
        }));

        if (isMounted) {
          setConversations(normalized);
        }
      } catch (error) {
        console.error("Failed to load conversations", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  // --------------------
  // UI HANDLERS
  // --------------------
const handleSelectChat = async (chat) => {
  setSelectedChat(chat);
  setShowChatList(false);
  setMessages([]);
  setMessagesLoading(true);

  try {
    const data = await fetchConversationMessages(chat.id);

    const mappedMessages = data.map((m) => ({
      id: m.id,
      senderId: m.sender,
      senderName: m.sender_name,
      text: m.content,
      timestamp: new Date(m.created_at).toLocaleString(),
    }));

    setMessages(mappedMessages);
  } catch (error) {
    console.error("Failed to load messages", error);
  } finally {
    setMessagesLoading(false);
  }
};


  const handleBackToList = () => {
    setSelectedChat(null);
    setShowChatList(true);
  };

  // --------------------
  // LOADING STATE
  // --------------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading conversations...</p>
      </div>
    );
  }

  // --------------------
  // RENDER
  // --------------------
  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">

      {/* Desktop */}
      <div className="hidden md:flex w-full max-w-screen-2xl mx-auto">
        {/* Conversation List */}
        <div className="hidden md:flex md:w-96 flex-col">
          
          <ChatList
            chats={conversations}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Right Pane (empty for now) */}

{selectedChat ? (
  <div className="flex-1 flex flex-col h-full">
    <ChatWindow
      chat={selectedChat}
      messages={messages}
      loadingMessages={messagesLoading}
      currentUserId={currentUserId}
      onSendMessage={handleSendMessage}
      connected=  {connected}
    />
  </div>
) : (
  <EmptyState />
)}





        {/* <div className="hidden md:flex md:flex-1 flex-col items-stretch">
          <div className="w-full max-w-3xl flex-1 flex flex-col">
            <EmptyState />
          </div>
        </div> */}
      </div>

      {/* Mobile */}
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
                chats={conversations}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
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

              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessagesPageResponsive;
