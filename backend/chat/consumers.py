from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .permissions import user_is_conversation_participant
from django.utils.timezone import localtime, now
from .models import Message, Conversation, ChatAttachment



import json
from channels.generic.websocket import AsyncWebsocketConsumer


import logging
logger = logging.getLogger(__name__)



from django.db import transaction

@database_sync_to_async
def mark_message_as_read(message_id, user, conversation_id):
    logger.info(f"Marking message: {message_id, user.id, conversation_id}")

    try:
        with transaction.atomic():
            message = (
                Message.objects
                .select_for_update()
                .get(id=message_id, conversation_id=conversation_id)
            )

            # Sender cannot mark own message as read
            if message.sender_id == user.id:
                logger.info("Reader is sender; skipping")
                return None

            if message.is_read:
                return message

            message.is_read = True
            message.read_at = now()
            message.save(update_fields=["is_read", "read_at"])

            return message

    except Message.DoesNotExist:
        return None


@database_sync_to_async
def create_message(conversation_id, sender, text, attachment):
    conversation = Conversation.objects.get(id=conversation_id)

    message = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=text,
    )

    if attachment:
        ChatAttachment.objects.create(
            message=message,
            file_url=attachment["file_url"],
            file_name=attachment["file_name"],
            file_type=attachment["file_type"],
            file_size=attachment["file_size"],
            cloudinary_public_id=attachment.get("public_id"),
        )

    return message



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


    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        data = json.loads(text_data)

        event_type = data.get("type", "message")

        logger.info(f"{data=}")
        logger.info(f"{event_type=}")

        # READ RECEIPT
        if event_type == "read":
            try:
                message_id = data.get("message_id")
                if not message_id:
                    return

                message = await mark_message_as_read(
                    message_id=message_id,
                    user=self.user,
                    conversation_id=self.conversation_id,
                )

                if not message:
                    return

                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "read_ack",
                        "message_id": message.id,
                    },
                )
            except Exception as e:
                logger.error("READ ERROR", exc_info=e)
            return

        # NORMAL MESSAGE (text + attachment)
        payload = data.get("content", {})

        text = payload.get("text", "")
        attachment = payload.get("attachment")

        if isinstance(text, str):
            text = text.strip()
        else:
            text = ""

        if not text and not attachment:
            return

        message = await create_message(
            conversation_id=self.conversation_id,
            sender=self.user,
            text=text,
            attachment=attachment,
        )

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chat_message",
                "message": {
                    "id": message.id,
                    "conversation_id": self.conversation_id,
                    "sender_id": self.user.id,
                    "sender_name": self.user.email,
                    "content": message.content,
                    "attachment": attachment,
                    "created_at": localtime(message.created_at).isoformat(),
                    "is_read": False,
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

    async def read_ack(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "read_ack",
                    "message_id": event["message_id"],
                }
            )
        )

