import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAdminTicketDetail,
  replyToTicket,
  updateTicketStatus,
} from "@/apis/admin/supportTickets";
import { formatDateTime } from "@/utils/common/utils";

function normalizeUsername(value) {
  if (typeof value !== "string") return value;
  if (!value.includes("@")) return value;
  return value.split("@")[0] || value;
}

function resolveAuthorLabel(message) {
  if (!message) return "Unknown";
  if (message.author_username) return normalizeUsername(message.author_username);
  if (message.author?.username) return normalizeUsername(message.author.username);
  if (message.author_email) return normalizeUsername(message.author_email);
  if (message.author_name) return message.author_name;
  if (typeof message.author === "string") return message.author;
  if (typeof message.author === "number") return `User #${message.author}`;
  if (message.author?.email) return normalizeUsername(message.author.email);
  if (message.author?.id) return `User #${message.author.id}`;
  return "Unknown";
}

function resolveTicketOwner(ticket) {
  if (!ticket) return "—";
  if (ticket.user_username) return normalizeUsername(ticket.user_username);
  if (ticket.user?.username) return normalizeUsername(ticket.user.username);
  if (ticket.user_email) return normalizeUsername(ticket.user_email);
  if (typeof ticket.user === "number") return `User #${ticket.user}`;
  if (ticket.user?.email) return normalizeUsername(ticket.user.email);
  if (ticket.user?.id) return `User #${ticket.user.id}`;
  return "—";
}

function resolveTicketOwnerRole(ticket) {
  if (!ticket) return "—";
  return ticket.user_role || ticket.user?.role || "—";
}

export default function AdminTicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("open");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      // Ticket detail includes full thread messages.
      const data = await getAdminTicketDetail(id);
      setTicket(data);
      setSelectedStatus(data?.status || "open");
    } catch (error) {
      console.error("Failed to load ticket detail", error);
      setLoadError("Unable to load ticket details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const messages = useMemo(() => {
    const rawMessages = ticket?.messages || [];
    return rawMessages.map((message) => {
      const content =
        message.message || message.body || message.content || "Empty message";
      const authorRole =
        message.author_role || message.author?.role || "";
      const isAdminMessage = authorRole === "admin";

      return {
        id: message.id,
        content,
        createdAt: message.created_at,
        authorLabel: resolveAuthorLabel(message),
        isAdminMessage,
      };
    });
  }, [ticket]);

  const handleReplySubmit = async (event) => {
    event.preventDefault();
    setReplyError("");
    setReplySuccess("");

    const cleanMessage = replyText.trim();
    if (!cleanMessage) {
      setReplyError("Reply message is required.");
      return;
    }

    try {
      setReplying(true);
      await replyToTicket(id, cleanMessage);
      setReplyText("");
      setReplySuccess("Reply posted successfully.");
      // Reload to ensure UI reflects server ordering/transformations.
      await fetchTicket();
    } catch (error) {
      console.error("Failed to send reply", error);
      setReplyError("Failed to post reply. Please try again.");
    } finally {
      setReplying(false);
    }
  };

  const handleStatusUpdate = async () => {
    setStatusError("");
    setStatusSuccess("");

    if (!ticket) return;
    if (selectedStatus === ticket.status) {
      setStatusSuccess("Status is already up to date.");
      return;
    }

    try {
      setUpdatingStatus(true);
      const updated = await updateTicketStatus(id, selectedStatus);

      setTicket((previous) => ({
        ...previous,
        ...updated,
        status: updated?.status || selectedStatus,
      }));
      window.dispatchEvent(new Event("admin-support-tickets-updated"));
      setStatusSuccess("Ticket status updated.");
    } catch (error) {
      console.error("Failed to update ticket status", error);
      setStatusError("Failed to update ticket status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading ticket details...</div>;
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {loadError}
        </div>
        <button
          onClick={() => navigate("/admin/tickets")}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.id}</h1>
          <p className="text-gray-700 mt-1">{ticket.subject || "Untitled ticket"}</p>
        </div>
        <button
          onClick={() => navigate("/admin/tickets")}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Ticket Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">User</p>
            <p className="font-medium text-gray-900">{resolveTicketOwner(ticket)}</p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p className="font-medium text-gray-900">
              {ticket.created_at ? formatDateTime(ticket.created_at) : "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Current Status</p>
            <p className="font-medium text-gray-900">{ticket.status || "open"}</p>
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-medium text-gray-900">{resolveTicketOwnerRole(ticket)}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white"
          >
            <option value="open">open</option>
            <option value="closed">closed</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updatingStatus}
            className={`h-10 px-4 text-sm rounded-lg ${
              updatingStatus
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {updatingStatus ? "Updating..." : "Update Status"}
          </button>
        </div>

        {statusError && (
          <p className="text-sm text-red-600 mt-3">{statusError}</p>
        )}
        {statusSuccess && (
          <p className="text-sm text-green-600 mt-3">{statusSuccess}</p>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Message Thread</h2>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-xl border p-3 ${
                message.isAdminMessage
                  ? "bg-blue-50 border-blue-100"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex flex-wrap justify-between gap-2">
                <p className="text-sm font-medium text-gray-900">{message.authorLabel}</p>
                <time className="text-xs text-gray-500">
                  {message.createdAt ? formatDateTime(message.createdAt) : "—"}
                </time>
              </div>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{message.content}</p>
            </article>
          ))}

          {messages.length === 0 && (
            <p className="text-sm text-gray-500">No messages in this ticket yet.</p>
          )}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Post Reply</h2>

        <form onSubmit={handleReplySubmit} className="space-y-3">
          <textarea
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            rows={5}
            placeholder="Write your reply..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={replying}
              className={`px-4 py-2 text-sm rounded-lg ${
                replying
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {replying ? "Posting..." : "Post Reply"}
            </button>
          </div>

          {replyError && <p className="text-sm text-red-600">{replyError}</p>}
          {replySuccess && <p className="text-sm text-green-600">{replySuccess}</p>}
        </form>
      </section>
    </div>
  );
}
