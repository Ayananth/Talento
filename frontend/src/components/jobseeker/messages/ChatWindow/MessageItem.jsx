import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";
import { Attachment } from "./Attachment";



const getMessageStatus = (msg) => {
  if (msg.isRead) return "read";
  return "delivered";
};


const MessageItem = ({
  msg,
  isMine,
  sendRead,
  isTabVisible,
  currentUserId
}) => {
  const ref = useRef(null);
  const hasMarkedRead = useRef(false);

  useEffect(() => {
    if (isMine) return;
    if (msg.isRead) return;
    if (!isTabVisible) return;
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasMarkedRead.current) {
          hasMarkedRead.current = true;
          sendRead(msg.id);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isTabVisible]);

  // 🔹 HIDE EMPTY MESSAGE (optional but recommended)
  if (!msg.text && !msg.attachment) return null;

  return (
    <div
      ref={ref}
      className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
        isMine
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-slate-100 text-slate-900 rounded-bl-none"
      }`}
    >
      {/* TEXT */}
      {msg.text && (
        <p className="whitespace-pre-wrap">{msg.text}</p>
      )}

      {/* ATTACHMENT */}
      {msg.attachment && (
        <Attachment attachment={msg.attachment} />
      )}

      <div className="flex items-center justify-end gap-2 text-xs opacity-70 mt-1">
        <span>{formatTime(msg.timestamp)}</span>
        {isMine && (
          <span className="select-none">
            {msg.isRead ? "Seen" : "Sent"}
          </span>
        )}
      </div>
    </div>
  );
};


export default MessageItem;


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
