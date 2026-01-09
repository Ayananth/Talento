import React, { useEffect, useRef } from "react";

const MessageList = ({ messages, currentUserId, loading }) => {
  const containerRef = useRef(null);
  const prevMessageCount = useRef(0);

  useEffect(() => {
    if (loading) return;

    if (prevMessageCount.current === 0) {
      prevMessageCount.current = messages.length;
      return;
    }

    // ✅ Scroll ONLY when a new message is added
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
              <span className="block text-xs opacity-70 mt-1 text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
