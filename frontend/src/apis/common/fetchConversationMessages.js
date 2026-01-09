import api from "@/apis/api";

export async function fetchConversationMessages(conversationId) {
  const response = await api.get(
    `v1/chat/conversations/${conversationId}/messages/`
  );
  return response.data;
}
