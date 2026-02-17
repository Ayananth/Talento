import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)


class UserNotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]

        # Reject unauthenticated users
        if not user or user.is_anonymous:
            logger.warning("Anonymous user tried to connect to notification socket")
            await self.close(code=4001)
            return

        self.user = user
        self.group_name = f"user_{user.id}"

        # Join user-specific group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        logger.info(f"User {user.id} connected to notifications")

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        logger.info(f"User {self.user.id} disconnected from notifications")

    # This matches "type": "unread_event"
    async def unread_event(self, event):
        await self.send(
            text_data=json.dumps({
                "type": "unread_event",
                "conversation_id": event["conversation_id"],
                "message_id": event["message_id"],
                "sender_id": event["sender_id"],
                "created_at": event["created_at"],
            })
        )
