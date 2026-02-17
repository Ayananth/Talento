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
import { useLocation, useNavigate } from "react-router-dom";
 import useUnreadSocket from "../../hooks/useUnreadSocket";
import { useUnread } from "@/context/UnreadContext";


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

  const { setTotalUnread } = useUnread();

  // console.log("User in MessagesPageResponsive:", user);
  const currentUserId = Number(user?.user_id);

const accessToken = useMemo(() => getAccessToken(), []);
const navigate = useNavigate();

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

const handleUnreadEvent = useCallback(
  (event) => {
    const convoId = Number(event.conversation_id);

    // If open chat → ignore (already seen)
    if (convoId === activeConversationId) return;

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === convoId
          ? {
              ...chat,
              unread_count: (chat.unread_count ?? 0) + 1,
            }
          : chat
      )
    );

    setTotalUnread((prev) => prev + 1);
  },
  [activeConversationId, setTotalUnread]
);

useUnreadSocket({
  token: accessToken,
  onUnread: handleUnreadEvent,
});




  const hasConversation = Boolean(selectedChat?.id);
  const sendingDisabled = hasConversation && !connected;


const location = useLocation();
useEffect(() => {
  const targetConversationId = Number(location.state?.openConversationId);
  if (!targetConversationId) return;
  if (activeConversationId === targetConversationId) return;

  const convo = conversations.find((c) => Number(c.id) === targetConversationId);
  if (!convo) return;

  handleSelectChat(convo);
  setShowChatList(false);
  navigate(location.pathname, { replace: true, state: {} });
}, [
  location.pathname,
  location.state?.openConversationId,
  conversations,
  activeConversationId,
  navigate,
]);

useEffect(() => {
  if (!location.state?.draftChat) return;
  if (selectedChat?.id) return;

  setSelectedChat(location.state.draftChat);
  setShowChatList(false);
  navigate(location.pathname, { replace: true, state: {} });
}, [location.pathname, location.state?.draftChat, selectedChat?.id, navigate]);




const handleSendMessage = async (payload) => {
  if (!selectedChat) return;

  const text = payload?.text ?? "";
  const attachment = payload?.attachment ?? null;

  const hasText =
    typeof text === "string" && text.trim().length > 0;
  const hasAttachment = Boolean(attachment);

  if (!hasText && !hasAttachment) {
    console.warn("Invalid message payload:", payload);
    return;
  }

  // --------------------
  // Existing conversation → WebSocket
  // --------------------
  if (selectedChat.id) {
    sendMessage({
      text: hasText ? text.trim() : "",
      attachment,
    });
    return;
  }

  // --------------------
  // First message → REST API
  // --------------------
  try {
    const data = await startConversation({
      jobId: selectedChat.jobId,
      recipientId: selectedChat.otherUserId,
      content: hasText ? text.trim() : "", // allowed
    });

    const { conversation_id, message } = data;

    const newChat = {
      ...selectedChat,
      id: conversation_id,
      lastMessage: message.content,
      timestamp: new Date(message.created_at).toLocaleString(),
    };

    setConversations((prev) => [newChat, ...prev]);
    setSelectedChat(newChat);
    setActiveConversationId(conversation_id);

    setMessages([
      {
        id: message.id,
        senderId: Number(message.sender_id),
        text: message.content,
        attachment: attachment ?? null,
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
          name: c.other_user?.name ?? "Unknown",
          jobTitle: c.other_user?.job ?? "Job",
          lastMessage: c.last_message ?? "No messages yet",
          timestamp: c.last_message_time
            ? new Date(c.last_message_time).toLocaleString()
            : "",
          unread_count: c.unread_count,
          isBlocked: false,
          companyName: null,
          companyLogo: c.other_user?.img ?? null,
        }));

        if (isMounted) {
          setConversations(normalized);
          const initialTotal = normalized.reduce(
            (sum, c) => sum + (c.unread_count ?? 0),
            0
          );

          setTotalUnread(initialTotal);
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
  setTotalUnread(prev => prev - (chat.unread_count ?? 0));
  setConversations(prev =>
    prev.map(c =>
      c.id === chat.id
        ? { ...c, unread_count: 0 }
        : c
    )
  );

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
