import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Filter } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import {
  getRecruiterNotifications,
  getRecruiterUnreadNotificationsCount,
  markAllRecruiterNotificationsRead,
  updateRecruiterNotificationReadStatus,
} from "@/apis/recruiter/apis";
import { PAGE_SIZE } from "@/constants/constants";
import { useUnread } from "@/context/UnreadContext";

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "JobApplication", label: "Job Application" },
  { value: "StatusChange", label: "Status Change" },
  { value: "NewMessage", label: "New Message" },
  { value: "Other", label: "Other" },
];

const READ_OPTIONS = [
  { value: "", label: "All" },
  { value: "false", label: "Unread" },
  { value: "true", label: "Read" },
];

const TYPE_LABELS = {
  JobApplication: "Job Application",
  StatusChange: "Status Change",
  NewMessage: "New Message",
  Other: "Other",
};

const RecruiterNotificaionsListPage = () => {
  const { setUnreadNotificationsCount } = useUnread();
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isReadFilter, setIsReadFilter] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  const totalPages = Math.ceil(count / Number(PAGE_SIZE || 10));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [data, unreadCount] = await Promise.all([
        getRecruiterNotifications({
          page,
          ordering,
          search,
          type: typeFilter,
          isRead: isReadFilter,
        }),
        getRecruiterUnreadNotificationsCount(),
      ]);

      setNotifications(data.results || []);
      setCount(data.count || 0);
      setUnreadNotificationsCount(unreadCount);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  }, [page, ordering, search, typeFilter, isReadFilter, setUnreadNotificationsCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const hasActiveFilters = useMemo(
    () => Boolean(search || typeFilter || isReadFilter),
    [search, typeFilter, isReadFilter]
  );
  const handleToggleReadStatus = async (notificationId, isRead) => {
    try {
      setUpdatingId(notificationId);
      await updateRecruiterNotificationReadStatus(notificationId, isRead);
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
      await markAllRecruiterNotificationsRead();
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Track updates related to your account and jobs</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search title or message..."
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 border border-gray-300 rounded-lg bg-white"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={isReadFilter}
              onChange={(e) => {
                setIsReadFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 border border-gray-300 rounded-lg bg-white"
            >
              {READ_OPTIONS.map((option) => (
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
              className="h-10 px-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setTypeFilter("");
                  setIsReadFilter("");
                  setOrdering("-created_at");
                  setPage(1);
                }}
                className="h-10 px-4 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Filter className="w-4 h-4" />
              <span>{count} notification(s) found</span>
            </div>

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

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 bg-gray-50 border-b px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <div className="col-span-5">Notification</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Action</div>
          </div>

          <div className="divide-y">
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <div className="hidden md:grid grid-cols-12 px-6 py-4 items-start gap-3">
                  <div className="col-span-5">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.title || TYPE_LABELS[notification.type] || "Notification"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message || "No message"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
                      {TYPE_LABELS[notification.type] || notification.type}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        notification.is_read
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {notification.is_read ? "Read" : "Unread"}
                    </span>
                  </div>

                  <div className="col-span-2 text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>

                  <div className="col-span-2">
                    <button
                      onClick={() =>
                        handleToggleReadStatus(notification.id, !notification.is_read)
                      }
                      disabled={updatingId === notification.id}
                      className={`text-xs px-3 py-1 rounded-md border ${
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

                <div className="md:hidden px-4 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.title || TYPE_LABELS[notification.type] || "Notification"}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        notification.is_read
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {notification.is_read ? "Read" : "Unread"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {notification.message || "No message"}
                  </p>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {TYPE_LABELS[notification.type] || notification.type}
                    </span>
                    <span className="text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleToggleReadStatus(notification.id, !notification.is_read)
                    }
                    disabled={updatingId === notification.id}
                    className={`text-xs px-3 py-1 rounded-md border ${
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
              </React.Fragment>
            ))}
          </div>

          {!loading && notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
              <p className="mt-1 text-sm text-gray-500">Try changing filters or check back later.</p>
            </div>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        {loading && (
          <p className="text-sm text-gray-500 mt-3">Loading notifications...</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterNotificaionsListPage;
