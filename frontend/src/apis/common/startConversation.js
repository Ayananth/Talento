import api from "@/apis/api";
export async function startConversation({ jobId, recipientId, content }) {
  const res = await api.post("v1/chat/conversations/start/", {
    job_id: jobId,
    recipient_id: recipientId,
    content,
  });

  console.log(res.data)

  return res.data;
}
