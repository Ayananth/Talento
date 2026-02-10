import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE } from "@/constants/constants";
import {
  getAdminNotifications,
  markAllAdminNotificationsRead,
  updateAdminNotificationReadStatus,
} from "@/apis/admin/notifications";

const READ_FILTERS = [
  { value: "", label: "All" },
  { value: "false", label: "Unread" },
  { value: "true", label: "Read" },
];

const TYPE_FILTERS = [
  { value: "", label: "All Types" },
  { value: "JobApplication", label: "Job Application" },
  { value: "StatusChange", label: "Status Change" },
  { value: "NewMessage", label: "New Message" },
  { value: "Other", label: "Other" },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [isReadFilter, setIsReadFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  const totalPages = Math.ceil(count / Number(PAGE_SIZE || 10));
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminNotifications({
        page,
        ordering,
        isRead: isReadFilter,
        type: typeFilter,
      });

      setNotifications(data.results || []);
      setCount(data.count || 0);
    } catch (error) {
      console.error("Failed to load admin notifications", error);
    } finally {
      setLoading(false);
    }
  }, [page, ordering, isReadFilter, typeFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const hasActiveFilters = useMemo(
    () => Boolean(isReadFilter || typeFilter || ordering !== "-created_at"),
    [isReadFilter, typeFilter, ordering]
  );

  const handleToggleReadStatus = async (notificationId, isRead) => {
    try {
      setUpdatingId(notificationId);
      await updateAdminNotificationReadStatus(notificationId, isRead);
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to update notification status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await markAllAdminNotificationsRead();
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const formatDateTime = (value) => new Date(value).toLocaleString();

    const redirectNotification = (notification) => {
      if (notification.type === "RecruiterActions") {
        navigate("/admin/recruiter/approvals/" + notification.related_id);
      }
      if (notification.type === "JobPosted") {
        navigate("/admin/jobs/" + notification.related_id);
      }
      if (notification.type === "NewSubscriber") {
        navigate("/admin/transactions/" + notification.related_id);
      }
      if (notification.type === "UserRegistraion") {
        navigate("/admin/users/" + notification.related_id);
      }
    };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-600 mt-1">Latest admin-side platform notifications.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="inline-flex w-full md:w-auto bg-gray-100 rounded-xl p-1">
            {READ_FILTERS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setIsReadFilter(option.value);
                  setPage(1);
                }}
                className={`flex-1 md:flex-none px-4 py-2 text-sm rounded-lg transition ${
                  isReadFilter === option.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white"
            >
              {TYPE_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setIsReadFilter("");
                  setTypeFilter("");
                  setOrdering("-created_at");
                  setPage(1);
                }}
                className="h-10 px-4 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">
            {count} notification{count === 1 ? "" : "s"}
          </p>
          <button
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className={`h-8 px-3 text-xs rounded-lg border ${
              markingAll
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
            }`}
          >
            {markingAll ? "Marking..." : "Mark all as read"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className={`bg-white rounded-2xl border shadow-sm p-4 md:p-5 transition ${
              notification.is_read
                ? "border-gray-200"
                : "border-blue-200 bg-gradient-to-r from-blue-50/60 to-white"
            }`}
          >
            {console.log("Notification:", notification)}
            <div className="flex items-start gap-3" onClick={() => redirectNotification(notification)}>
              <div className="mt-1">
                <span
                  className={`block w-2.5 h-2.5 rounded-full ${
                    notification.is_read ? "bg-gray-300" : "bg-blue-600"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <h2 className="text-sm md:text-base font-semibold text-gray-900">
                    {notification.title || "Notification"}
                  </h2>
                  <time className="text-xs text-gray-500 shrink-0">
                    {formatDateTime(notification.created_at)}
                  </time>
                </div>

                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {notification.message || "No message"}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      notification.is_read
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {notification.is_read ? "Read" : "Unread"}
                  </span>

                  <button
                    onClick={() =>
                      handleToggleReadStatus(notification.id, !notification.is_read)
                    }
                    disabled={updatingId === notification.id}
                    className={`text-xs px-3 py-1.5 rounded-md border ${
                      updatingId === notification.id
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {updatingId === notification.id
                      ? "Saving..."
                      : notification.is_read
                      ? "Mark unread"
                      : "Mark read"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {!loading && notifications.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed text-center py-16">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-base font-medium text-gray-900">No notifications found</h3>
            <p className="mt-1 text-sm text-gray-500">You are all caught up.</p>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {loading && (
        <p className="text-sm text-gray-500 mt-3">Loading notifications...</p>
      )}
    </div>
  );
}
