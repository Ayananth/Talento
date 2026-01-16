import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ConstructionIcon } from "lucide-react";

import ChatList from "../../components/jobseeker/messages/ChatList";
import ChatWindow from "../../components/jobseeker/messages/ChatWindow";
import EmptyState from "../../components/jobseeker/messages/EmptyState";
import { fetchConversations } from "../../apis/common/fetchConversations";
import { fetchConversationMessages } from "../../apis/common/fetchConversationMessages";
 import useAuth from "@/auth/context/useAuth";
 import { getAccessToken } from "../../auth/context/authUtils";
 import useChatSocket from "../../hooks/useChatSocket";
 import { startConversation } from "../../apis/common/startConversation";
 import { useLocation } from "react-router-dom";


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

  const [activeConversationId, setActiveConversationId] = useState(null);


  const { user } = useAuth();
  // console.log("User in MessagesPageResponsive:", user);
  const currentUserId = Number(user?.user_id);

const accessToken = useMemo(() => getAccessToken(), []);

const handleWsMessage = useCallback((msg) => {
  setMessages((prev) => [
    ...prev,
    {
      id: msg.id,
      senderId: Number(msg.sender_id),
      senderName: msg.sender_name,
      text: msg.content,
      attachment: msg.attachment ?? null,
      timestamp: new Date(msg.created_at).toLocaleString(),
      isRead: false,
    },
  ]);
}, []);


const handleReadAck = useCallback((messageId) => {
  setMessages((prev) =>
    prev.map((m) =>
      m.id === messageId ? { ...m, isRead: true } : m
    )
  );
}, []);


const { connected, sendMessage, sendRead } = useChatSocket({
conversationId: activeConversationId,
  token: accessToken,
  onMessage: handleWsMessage,
  onReadAck: handleReadAck,
});



  const hasConversation = Boolean(selectedChat?.id);
  const sendingDisabled = hasConversation && !connected;





const location = useLocation();
useEffect(() => {
  console.log("Location state on mount:", location.state);
  if (location.state?.openConversationId) {
    const convo = conversations.find(
      (c) => c.id === location.state.openConversationId
    );

    console.log("Auto-opening conversation from state:", convo);

    if (convo) {
      handleSelectChat(convo);
      setShowChatList(false);
    }
  }
}, [location.state, conversations]);

useEffect(() => {
  if (location.state?.draftChat) {
    setSelectedChat(location.state.draftChat);
    setShowChatList(false);
  }
}, []);




const handleSendMessage = async (text) => {
  if (!selectedChat) return;

  // CASE A: conversation already exists → WebSocket
  if (selectedChat.id) {
    sendMessage(text);
    return;
  }

  // CASE B: first message → REST API
  try {
    const data = await startConversation({
      jobId: selectedChat.jobId,
      recipientId: selectedChat.otherUserId,
      content: text,
    });

    const { conversation_id, message } = data;

    //  Update selected chat with real conversation id
    const newChat = {
      ...selectedChat,
      id: conversation_id,
      lastMessage: message.content,
      timestamp: new Date(message.created_at).toLocaleString(),
    };

    // Add to conversation list
    setConversations((prev) => [newChat, ...prev]);

    //  Select it (this will open WebSocket automatically)
    setSelectedChat(newChat);

    // Add message to message list
    setMessages([
      {
        id: message.id,
        senderId: Number(message.sender_id),
        text: message.content,
        timestamp: new Date(message.created_at).toLocaleString(),
      },
    ]);

  } catch (err) {
    console.error("Failed to start conversation", err);
  }
};


  // --------------------
  // LOAD CONVERSATIONS
  // --------------------
  useEffect(() => {
    let isMounted = true;

    async function loadConversations() {
      try {
        const data = await fetchConversations();
        console.log("Fetched conversations:", data);


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
          // unread_count: c.unread_count,
          unread_count: 0,

          isBlocked: false,
          companyName: null,
          companyLogo: c.other_user?.img ?? null,
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
  setActiveConversationId(chat.id);
  setShowChatList(false);
  setMessages([]);
  setMessagesLoading(true);

  try {
    const data = await fetchConversationMessages(chat.id);

  const mappedMessages = data.map((m) => ({
    id: m.id,
    senderId: Number(m.sender),
    senderName: m.sender_name,
    text: m.content,
    attachment: m.attachment ?? null,
    timestamp: new Date(m.created_at).toLocaleString(),
    isRead: m.is_read ?? false,
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
    setActiveConversationId(null);
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
      <div className="hidden md:flex w-full max-w-7xl mx-auto">
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
      sendingDisabled={sendingDisabled}
      sendRead={sendRead}
      activeConversationId={activeConversationId}
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
{/* Mobile */}
{/* Mobile */}
<div className="md:hidden w-full h-full flex flex-col min-h-0">
  <AnimatePresence mode="wait">
    {showChatList ? (
      <motion.div
        key="chat-list"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="flex-1 min-h-0"
      >
        <ChatList
          chats={conversations}
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
        className="flex-1 flex flex-col bg-white min-h-0"
      >
        {/* Mobile Header */}
        <div className="flex items-center gap-3 p-4 border-b shrink-0">
          <button onClick={handleBackToList}>
            ←
          </button>
          <span className="font-medium">{selectedChat?.name}</span>
        </div>

        {/* Chat */}
        <ChatWindow
          chat={selectedChat}
          messages={messages}
          loadingMessages={messagesLoading}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          connected={connected}
          sendingDisabled={sendingDisabled}
        />
      </motion.div>
    )}
  </AnimatePresence>
</div>


    </div>
  );
};

export default MessagesPageResponsive;
