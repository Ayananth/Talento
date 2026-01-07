import { useEffect, useRef, useState } from "react";

export default function Chat({ conversationId=101, 
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0Mn0.ceovGGz_Y0eu9xKY7Uorny1d93KsO_KFddxHh5u_DRM", 
    currentUserId=42 }) {
    
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  // ---------------- LOAD HISTORY ----------------
  async function loadHistory() {
    const res = await fetch(
      `http://127.0.0.1:8000/api/conversations/${conversationId}/messages`
    );
    const data = await res.json();
    setMessages(data);
  }

  // ---------------- CONNECT WS ----------------
  function connectWebSocket() {
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${conversationId}?token=${token}`
    );

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    socketRef.current = socket;
  }

  // ---------------- SEND MESSAGE ----------------
  function sendMessage() {
    if (!text.trim()) return;
    if (!socketRef.current) return;

    socketRef.current.send(text);
    setText(""); // clear input
  }

  // ---------------- INIT ----------------
  useEffect(() => {
    loadHistory().then(connectWebSocket);

    return () => socketRef.current?.close();
  }, [conversationId]);

  // ---------------- UI ----------------
  return (
    <div style={{ width: 400, border: "1px solid #ccc" }}>
      {/* Messages */}
      <div
        style={{
          height: 300,
          overflowY: "auto",
          padding: 10,
          borderBottom: "1px solid #ddd",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign:
                msg.sender_id === currentUserId ? "right" : "left",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background:
                  msg.sender_id === currentUserId
                    ? "#DCF8C6"
                    : "#F1F1F1",
                display: "inline-block",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", padding: 8 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 6 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 6 }}>
          Send
        </button>
      </div>
    </div>
  );
}

