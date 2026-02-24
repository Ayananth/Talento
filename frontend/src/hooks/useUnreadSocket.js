import { useEffect, useRef } from "react";
import { WS_BASE_URL } from "../constants/constants";

export default function useUnreadSocket({ token, onUnread }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(
      `${WS_BASE_URL}/ws/user/notifications/?token=${token}`
    );

    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "unread_event") {
        onUnread(data);
      }
    };

    ws.onclose = () => {
      console.log("Unread socket closed");
    };

    return () => ws.close();
  }, [token, onUnread]);
}
