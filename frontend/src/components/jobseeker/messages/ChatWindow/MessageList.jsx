import React, { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";

const MessageList = ({ messages, currentUserId, loading }) => {
  const containerRef = useRef(null);
  const prevMessageCount = useRef(0);

  useEffect(() => {
    if (loading) return;

    if (prevMessageCount.current === 0) {
      prevMessageCount.current = messages.length;
      return;
    }

    if (messages.length > prevMessageCount.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }

    prevMessageCount.current = messages.length;
  }, [messages, loading]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">Loading messages...</p>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">No messages yet</p>
      </div>
    );
  }

  const renderStatusIcon = (msg) => {
    // Support both patterns safely
    const status = msg.status;
    const isRead = msg.isRead || status === "read";
    const isDelivered =
      msg.isDelivered || status === "delivered" || isRead;

    if (isRead) {
      return <CheckCheck size={14} className="text-blue-400" />;
    }

    if (isDelivered) {
      return <CheckCheck size={14} className="text-slate-400" />;
    }

    return <Check size={14} className="text-slate-400" />;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 pb-24 space-y-3 overscroll-contain"
    >
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                isMine
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-100 text-slate-900 rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>

              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">
                  {msg.timestamp}
                </span>

                {isMine && renderStatusIcon(msg)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
