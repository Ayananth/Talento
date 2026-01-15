import api from "../../../apis/api"

export const uploadChatFile = async (chatId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `v1/chat/conversations/${chatId}/upload/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  console.log(res.data)

  return res.data;
};
