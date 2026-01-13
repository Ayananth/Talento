import { useEffect, useRef, useState } from "react";

export function useChat({ conversationId, token, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef(null);
  const shouldReconnectRef = useRef(true);

  // -------- Load history --------
  async function loadHistory() {
    const res = await fetch(
      `http://127.0.0.1:8000/api/conversations/${conversationId}/messages`
    );
    const data = await res.json();
    setMessages(data);
  }

  // -------- Mark as read --------
  async function markAsRead() {
    await fetch(
      `http://127.0.0.1:8000/api/conversations/${conversationId}/read?token=${token}`,
      { method: "POST" }
    );
  }

  // -------- Connect WebSocket --------
  function connect() {
    if (!conversationId) return;

    socketRef.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${conversationId}?token=${token}`
    );

    socketRef.current.onopen = () => {
      setConnected(true);
    };

    socketRef.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => [...prev, msg]);
    };

    socketRef.current.onclose = () => {
      setConnected(false);
      if (shouldReconnectRef.current) {
        setTimeout(connect, 2000);
      }
    };
  }

  // -------- Send message --------
  function sendMessage(text) {
    if (!socketRef.current || socketRef.current.readyState !== 1) return;
    socketRef.current.send(text);
  }

  // -------- Lifecycle --------
  useEffect(() => {
    if (!conversationId) return;
    shouldReconnectRef.current = true;

    loadHistory().then(() => {
      markAsRead();
      connect();
    });

    return () => {
      shouldReconnectRef.current = false;
      socketRef.current?.close(1000);
    };
  }, [conversationId]);

  return {
    messages,
    connected,
    sendMessage,
  };
}
