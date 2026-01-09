import React, { useState } from "react";
import { Send } from "lucide-react";

const MessageComposer = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 p-4 bg-white">
      <div className="flex items-end gap-3">
        <textarea
          rows={1}
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 resize-none rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
        />

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="p-2 rounded-lg bg-blue-600 text-white disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>

      <p className="mt-1 text-xs text-slate-400">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
};

export default MessageComposer;
