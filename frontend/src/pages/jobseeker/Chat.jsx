import { useEffect, useRef, useState } from "react";

export default function Chat({
  conversationId = 101,
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0Mn0.ceovGGz_Y0eu9xKY7Uorny1d93KsO_KFddxHh5u_DRM",
  currentUserId = 42,
}) {
  // ---------------- STATE ----------------
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);

  // ---------------- REFS ----------------
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  const MAX_RETRIES = 5;

  // ---------------- LOAD HISTORY ----------------
  async function loadHistory() {
    const res = await fetch(
      `http://127.0.0.1:8000/api/conversations/${conversationId}/messages`
    );
    const data = await res.json();
    setMessages(data);
  }

  // ---------------- CONNECT WEBSOCKET ----------------
  function connectWebSocket() {
    // Intentional close (do NOT reconnect)
    if (socketRef.current) {
      shouldReconnectRef.current = false;
      socketRef.current.close(1000, "Intentional reconnect");
    }

    shouldReconnectRef.current = true;

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${conversationId}?token=${token}`
    );

    socket.onopen = () => {
      console.log("🟢 WebSocket connected");
      setConnected(true);
      reconnectAttemptsRef.current = 0;
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    socket.onclose = (event) => {
      console.log("🔴 WebSocket closed", event.code);
      setConnected(false);

      // Reconnect ONLY on unexpected disconnect
      if (
        shouldReconnectRef.current &&
        event.code !== 1000
      ) {
        attemptReconnect();
      }
    };

    socket.onerror = (err) => {
      console.warn("⚠️ WebSocket error", err);
      // DO NOT call socket.close() here
    };

    socketRef.current = socket;
  }

  // ---------------- RECONNECT LOGIC ----------------
  function attemptReconnect() {
    if (reconnectAttemptsRef.current >= MAX_RETRIES) {
      console.log("❌ Max reconnect attempts reached");
      return;
    }

    const timeout =
      Math.pow(2, reconnectAttemptsRef.current) * 1000;

    console.log(`⏳ Reconnecting in ${timeout / 1000}s`);

    reconnectTimerRef.current = setTimeout(() => {
      reconnectAttemptsRef.current += 1;
      connectWebSocket();
    }, timeout);
  }

  // ---------------- SEND MESSAGE ----------------
  function sendMessage() {
    if (!text.trim()) return;
    if (!socketRef.current) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) return;

    socketRef.current.send(text);
    setText("");
  }

  // ---------------- INIT / CLEANUP ----------------
  useEffect(() => {
    loadHistory().then(() => {
      connectWebSocket();
    });

    return () => {
      shouldReconnectRef.current = false;
      socketRef.current?.close(1000, "Component unmounted");
      clearTimeout(reconnectTimerRef.current);
    };
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
          disabled={!connected}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder={
            connected ? "Type a message..." : "Reconnecting..."
          }
          style={{ flex: 1, padding: 6 }}
        />
        <button
          disabled={!connected}
          onClick={sendMessage}
          style={{ marginLeft: 6 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
