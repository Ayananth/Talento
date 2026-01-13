import api from "@/apis/api";
export async function fetchConversations() {
  const res = await api.get("v1/chat/conversations/");
  return res.data;
}
