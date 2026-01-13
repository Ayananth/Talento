import { useEffect, useRef, useState } from "react";

export default function useChatSocket({
  conversationId,
  token,
  onMessage,
  onReadAck
}) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);


useEffect(() => {
  console.log("WS effect run", conversationId);
  return () => {
    console.log("WS cleanup", conversationId);
  };
}, [conversationId]);


useEffect(() => {
  if (!conversationId || !token) return;

  console.log("Opening WS for", conversationId);

  const wsUrl = `ws://localhost:8002/ws/chat/${conversationId}/?token=${token}`;
  const socket = new WebSocket(wsUrl);
  socketRef.current = socket;

  socket.onopen = () => setConnected(true);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "message") onMessage(data);
    if (data.type === "read_ack") onReadAck?.(data.message_id);
  };

  socket.onclose = () => {
    console.log("WS closed");
    setConnected(false);
  };

  return () => {
    console.log("Cleaning WS", conversationId);
    socket.close();
  };
}, [conversationId, token, onMessage, onReadAck]);


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

  const sendRead = (messageId) => {
    
    if (!socketRef.current || socketRef.current.readyState !== 1) return;

    socketRef.current.send(
      JSON.stringify({
        type: "read",
        message_id: messageId,
      })
    );
  };

  console.log("WS connected state:", connected);

  return {
    connected,
    sendMessage,
    sendRead
  };
}
