import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatList from "../../components/jobseeker/messages/ChatList";
import EmptyState from "../../components/jobseeker/messages/EmptyState";
import { ArrowLeft } from "lucide-react";
import { fetchConversations } from "../../apis/common/fetchConversations";

const MessagesPageResponsive = () => {
  // ---- STATE ----
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);

  // ---- LOAD CONVERSATIONS ----
  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await fetchConversations();

        // Backend → UI mapping
        const mapped = data.map((c) => ({
          id: c.id,
          name: c.other_user.name,
          jobTitle: `Job #${c.other_user.job}`,
          lastMessage: c.last_message ?? "No messages yet",
          time: c.last_message_time
            ? new Date(c.last_message_time).toLocaleString()
            : "",
        }));

        setConversations(mapped);
        console.log("Fetched conversations:", mapped);
      } catch (error) {
        console.error("Failed to load conversations", error);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

  // ---- UI HANDLERS ----
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  // ---- LOADING STATE ----
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading conversations...</p>
      </div>
    );
  }

  // ---- RENDER ----
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden md:flex w-full max-w-screen-2xl mx-auto">
        {/* Desktop: Chat List */}
        <div className="hidden md:flex md:w-96 flex-col">
          <ChatList
            chats={conversations}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Desktop: Empty State */}
        <div className="hidden md:flex md:flex-1 flex-col items-stretch">
          <div className="w-full max-w-3xl flex-1 flex flex-col">
            {selectedChat ? <EmptyState /> : <EmptyState />}
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
// export async function fetchConversations() {
//   const res = await api.get("v1/chat/conversations/");
//   return res.data;
// }chConversations from "../../apis/common/fetchConversations"; 
