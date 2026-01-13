import { useEffect, useRef, useState } from "react";

export default function useChatSocket({
  conversationId,
  token,
  onMessage,
}) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!conversationId || !token) return;

    const wsUrl = `ws://localhost:8002/ws/chat/${conversationId}/?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WS connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Only handle actual chat messages
        if (data.type === "message") {
          onMessage(data);
        }
      } catch (err) {
        console.error("WS message parse error", err);
      }
    };

    socket.onclose = (e) => {
      console.log("WS closed", e.code);
      setConnected(false);
    };

    socket.onerror = (e) => {
      console.error("WS error", e);
    };

    return () => {
      socket.close();
    };
  }, [conversationId, token]);

  const sendMessage = (content) => {
    if (!socketRef.current || socketRef.current.readyState !== 1) {
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        content,
      })
    );
  };

  console.log("WS connected state:", connected);

  return {
    connected,
    sendMessage,
  };
}
