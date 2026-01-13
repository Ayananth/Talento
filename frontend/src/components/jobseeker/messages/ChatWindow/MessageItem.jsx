import { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";



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

console.log("READ CHECK", {
  msgId: msg.id,
  msgSender: msg.senderId,
  currentUserId,
  isMine,
});



    if (isMine) return;
    if (msg.isRead) return;
    if (!isTabVisible) return;
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasMarkedRead.current) {
          hasMarkedRead.current = true;
          console.log("sending to read:", msg, msg.id)
          sendRead(msg.id);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isTabVisible]);

  return (
    <div
      ref={ref}
      className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
        isMine
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-slate-100 text-slate-900 rounded-bl-none"
      }`}
    >
      <p>{msg.text}</p>
<div className="flex items-center justify-end gap-2 text-xs opacity-70 mt-1">
  <span>{msg.timestamp}</span>

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
