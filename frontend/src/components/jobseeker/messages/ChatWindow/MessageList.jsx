import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { Check, CheckCheck } from "lucide-react";


const getMessageStatus = (msg) => {
  if (msg.isRead) return "read";
  return "delivered";
};


const MessageList = ({
  messages,
  currentUserId,
  loading,
  sendRead,
}) => {
  const containerRef = useRef(null);
  const prevMessageCount = useRef(0);

  useEffect(() => {
    if (loading) return;

    if (messages.length > prevMessageCount.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }

    prevMessageCount.current = messages.length;
  }, [messages, loading]);

  if (loading) {
    return <div className="p-4 text-center">Loading messages...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 pb-24 space-y-3"
    >
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <MessageItem
              msg={msg}
              isMine={isMine}
              sendRead={sendRead}
              isTabVisible={document.visibilityState === "visible"}
              currentUserId={currentUserId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
