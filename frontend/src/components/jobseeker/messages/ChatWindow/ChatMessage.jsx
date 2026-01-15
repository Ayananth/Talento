const ChatMessage = ({ message, isOwn }) => {
  return (
    <div
      className={`mb-3 flex flex-col ${
        isOwn ? "items-end" : "items-start"
      }`}
    >
      {/* Sender name (optional) */}
      <span className="text-xs text-slate-500 mb-1">
        {message.sender_name}
      </span>

      <div
        className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
          isOwn
            ? "bg-blue-600 text-white"
            : "bg-slate-200 text-slate-900"
        }`}
      >
        {/* Text */}
        {message.content && (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}

        {/* Attachment */}
        {message.attachment && (
          <Attachment attachment={message.attachment} />
        )}
      </div>
    </div>
  );
};
