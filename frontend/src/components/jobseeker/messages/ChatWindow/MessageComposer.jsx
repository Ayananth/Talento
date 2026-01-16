import React, { useRef, useState } from "react";
import { Send, Paperclip, X, Loader2 } from "lucide-react";
import { uploadChatFile } from "../../../../apis/common/chat/uploadChatFile";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const MessageComposer = ({ onSend, disabled, chatId }) => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentMeta, setAttachmentMeta] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only PDF, Image, or Word files are allowed");
      return;
    }

    setSelectedFile(file);
    setAttachmentMeta(null); // reset old meta
  };

  const handleSend = async () => {
    if (disabled || uploading) return;
    if (!text.trim() && !selectedFile) return;

    try {
      let meta = null;

      //  Upload file FIRST (if exists)
      if (selectedFile) {
        setUploading(true);
        meta = await uploadChatFile(chatId, selectedFile);
        console.log("file uploaded, ", meta)
        setAttachmentMeta(meta);
        console.log("setTing Attachments")
      }

      console.log("Sending websocket")

      //Send message via WebSocket
      onSend({
        text: text.trim(),
        attachment: meta,
      });

      console.log("done websocket")


      //Reset state
      setText("");
      setSelectedFile(null);
      setAttachmentMeta(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("File upload failed", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeFile = () => {
    if (uploading) return;
    setSelectedFile(null);
    setAttachmentMeta(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border-t border-slate-200 p-4 bg-white shrink-0 sticky bottom-4">
      {/* Attachment preview */}
      {selectedFile && (
        <div className="mb-2 flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg text-sm">
          <span className="truncate flex-1">{selectedFile.name}</span>
          {!uploading && (
            <button
              onClick={removeFile}
              className="text-slate-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* File picker */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".pdf,.doc,.docx,image/*"
          onChange={handleFileChange}
          disabled={disabled || uploading}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          rows={1}
          placeholder={
            uploading ? "Uploading file..." : "Type a message…"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || uploading}
          className="flex-1 resize-none rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
        />

        <button
          onClick={handleSend}
          disabled={
            disabled ||
            uploading ||
            (!text.trim() && !selectedFile)
          }
          className="p-2 rounded-lg bg-blue-600 text-white disabled:bg-blue-300 hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      <p className="mt-1 text-xs text-slate-400">
        Enter to send · Shift+Enter for new line · Attach PDF / Image / Word
      </p>
    </div>
  );
};

export default MessageComposer;
