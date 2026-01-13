from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .permissions import user_is_conversation_participant
from django.utils.timezone import localtime
from .models import Message, Conversation


import json
from channels.generic.websocket import AsyncWebsocketConsumer


@database_sync_to_async
def create_message(conversation_id, sender, content):
    conversation = Conversation.objects.get(id=conversation_id)
    return Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content,
    )


@database_sync_to_async
def is_participant(user, conversation_id):
    return user_is_conversation_participant(user, conversation_id)


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]

        if not user or user.is_anonymous:
            await self.close(code=4001)
            return

        self.user = user
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]

        allowed = await is_participant(user, self.conversation_id)

        if not allowed:
            await self.close(code=4003)  # Forbidden
            return

        self.group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()


    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name,
            )


    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get("content", "").strip()

        if not content:
            return

        message = await create_message(
            conversation_id=self.conversation_id,
            sender=self.user,
            content=content,
        )

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chat_message",
                "message": {
                    "id": message.id,
                    "conversation_id": self.conversation_id,
                    "sender_id": self.user.id,
                    "sender_name": self.user.email,  # or profile name
                    "content": message.content,
                    "created_at": localtime(message.created_at).isoformat(),
                },
            },
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "message",
                    **event["message"],
                }
            )
        )
