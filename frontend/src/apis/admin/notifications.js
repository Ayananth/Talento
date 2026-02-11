import api from "@/apis/api";

export const getAdminNotifications = async ({
  page = 1,
  ordering = "-created_at",
  type = "",
  isRead = "",
} = {}) => {
  const res = await api.get("/v1/notifications/", {
    params: {
      page,
      ...(ordering && { ordering }),
      ...(type && { type }),
      ...(isRead !== "" && { is_read: isRead }),
    },
  });

  return res.data;
};

export const updateAdminNotificationReadStatus = async (notificationId, isRead) => {
  const res = await api.patch(
    `/v1/notifications/${notificationId}/read-status/`,
    { is_read: isRead }
  );
  return res.data;
};

export const markAllAdminNotificationsRead = async () => {
  const res = await api.patch("/v1/notifications/mark-all-read/");
  return res.data;
};

export const getAdminUnreadNotificationsCount = async () => {
  const res = await api.get("/v1/notifications/", {
    params: {
      page: 1,
      is_read: false,
    },
  });

  return res.data?.count ?? 0;
};
