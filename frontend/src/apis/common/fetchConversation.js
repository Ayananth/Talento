import api from "@/apis/api";

export async function fetchConversation(jobId) {
    console.log("Fetching conversation for job ID:", jobId);

    const res = await api.get("v1/chat/conversation/", {
      params: { job_id: jobId },
    });
    return res;
}