import { useEffect, useRef, useState } from "react";
import { WS_BASE_URL } from "../constants/constants";

export default function useChatSocket({
  conversationId,
  token,
  onMessage,
  onReadAck
}) {
  const socketRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  const onReadAckRef = useRef(onReadAck);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onReadAckRef.current = onReadAck;
  }, [onMessage, onReadAck]);

useEffect(() => {
  if (!conversationId || !token) return;

  const wsUrl = `${WS_BASE_URL}/ws/chat/${conversationId}/?token=${token}`;
  const socket = new WebSocket(wsUrl);
  socketRef.current = socket;

  socket.onopen = () => setConnected(true);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "message") onMessageRef.current?.(data);
    if (data.type === "read_ack") onReadAckRef.current?.(data.message_id);
  };

  socket.onclose = () => {
    setConnected(false);
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

  const sendRead = (messageId) => {
    
    if (!socketRef.current || socketRef.current.readyState !== 1) return;

    socketRef.current.send(
      JSON.stringify({
        type: "read",
        message_id: messageId,
      })
    );
  };

  return {
    connected,
    sendMessage,
    sendRead
  };
}
