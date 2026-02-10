import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { formatDateTime } from "@/utils/common/utils";
import {
  getJobseekerTicketDetail,
  replyJobseekerTicket,
} from "@/apis/jobseeker/supportTickets";

function resolveAuthorLabel(message) {
  if (!message) return "Unknown";
  if (message.author_email) return message.author_email;
  if (message.author_name) return message.author_name;
  if (typeof message.author === "string") return message.author;
  if (message.author?.email) return message.author.email;
  if (message.author?.username) return message.author.username;
  if (message.author?.id) return `User #${message.author.id}`;
  return "Unknown";
}

export default function JobseekerSupportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const data = await getJobseekerTicketDetail(id);
      setTicket(data);
    } catch (error) {
      console.error("Failed to load support ticket", error);
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
    return rawMessages.map((message) => ({
      id: message.id,
      content: message.message || message.body || message.content || "Empty message",
      createdAt: message.created_at,
      authorLabel: resolveAuthorLabel(message),
      isAdminMessage:
        (message.author_role || message.author?.role || "") === "admin",
    }));
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
      await replyJobseekerTicket(id, cleanMessage);
      setReplyText("");
      setReplySuccess("Reply posted successfully.");
      await fetchTicket();
    } catch (error) {
      console.error("Failed to post support reply", error);
      setReplyError("Failed to post reply.");
    } finally {
      setReplying(false);
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
          onClick={() => navigate("/profile/support")}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Back to Support
        </button>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.id}</h1>
          <p className="text-gray-700 mt-1">{ticket.subject || "Untitled ticket"}</p>
        </div>

        <button
          onClick={() => navigate("/profile/support")}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </header>

      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Ticket Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-gray-900">{ticket.status || "open"}</p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p className="font-medium text-gray-900">
              {ticket.created_at ? formatDateTime(ticket.created_at) : "—"}
            </p>
          </div>
        </div>
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

          {replyError && <p className="text-sm text-red-600">{replyError}</p>}
          {replySuccess && <p className="text-sm text-green-600">{replySuccess}</p>}
        </form>
      </section>
    </div>
  );
}
