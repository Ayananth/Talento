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
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  if (loading) {
    return <div className="p-4 text-center">Loading messages...</div>;
  }

  return (
<div className="p-6 pb-24 space-y-3">
  {messages.map((msg, index) => {
    const isMine = msg.senderId === currentUserId;

    const currentDate = formatDate(msg.timestamp);
    const prevDate =
      index > 0 ? formatDate(messages[index - 1].timestamp) : null;

    const showDateHeader = currentDate !== prevDate;

    return (
      <React.Fragment key={msg.id}>
        {showDateHeader && (
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 text-xs rounded-full bg-slate-200 text-slate-600">
              {currentDate}
            </span>
          </div>
        )}

        <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
          <MessageItem
            msg={msg}
            isMine={isMine}
            sendRead={sendRead}
            isTabVisible={document.visibilityState === "visible"}
            currentUserId={currentUserId}
          />
        </div>
      </React.Fragment>
    );
  })}

  <div ref={bottomRef} />
</div>
  );
};

export default MessageList;


const parseTimestamp = (timestamp) => {
  if (!timestamp) return null;

  if (timestamp instanceof Date) return timestamp;

  // First try native parsing (handles ISO and many locale strings).
  const nativeParsed = new Date(timestamp);
  if (!Number.isNaN(nativeParsed.getTime())) return nativeParsed;

  // Fallback for "DD/MM/YYYY, HH:mm:ss" style values.
  const [datePart, timePart] = String(timestamp).split(", ");
  if (!datePart || !timePart) return null;
  const [day, month, year] = datePart.split("/");
  const fallbackParsed = new Date(`${year}-${month}-${day}T${timePart}`);
  return Number.isNaN(fallbackParsed.getTime()) ? null : fallbackParsed;
};


const formatDate = (timestamp) => {
  const d = parseTimestamp(timestamp);
  if (!d || isNaN(d)) return "";

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (timestamp) => {
  const d = parseTimestamp(timestamp);
  if (!d || isNaN(d)) return "";

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
