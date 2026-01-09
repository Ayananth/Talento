import React, { useEffect, useRef } from "react";

const MessageList = ({ messages, currentUserId, loading }) => {
  const endRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="flex-1 overflow-y-auto p-6 space-y-3">
      {messages.map((msg) => {
        console.log(msg.senderId, currentUserId);
        const isMine = msg.senderId === currentUserId;
        console.log("isMine:", isMine);

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
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
