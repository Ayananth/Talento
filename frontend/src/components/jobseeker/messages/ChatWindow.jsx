import React from "react";
import { motion } from "framer-motion";
import MessageList from "./ChatWindow/MessageList";
import MessageComposer from "./ChatWindow/MessageComposer";

const ChatWindow = ({ chat, messages, loadingMessages, currentUserId, onSendMessage, sendingDisabled=false }) => {
  if (!chat) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-white h-screen"
    >
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {chat.name}
        </h2>
        <p className="text-sm text-slate-600">{chat.jobTitle}</p>
      </div>

      {/* Message History */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        loading={loadingMessages}
      />
      <MessageComposer
        onSend={onSendMessage}
        disabled={sendingDisabled}
      />
    </motion.div>
  );
};

export default ChatWindow;
