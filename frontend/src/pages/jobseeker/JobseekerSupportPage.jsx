import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE } from "@/constants/constants";
import { formatDateTime } from "@/utils/common/utils";
import {
  createJobseekerTicket,
  getJobseekerTickets,
} from "@/apis/jobseeker/supportTickets";

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

export default function JobseekerSupportPage() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const totalPages = Math.ceil(count / Number(PAGE_SIZE || 10));

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobseekerTickets({
        page,
        status: statusFilter,
      });

      // Handle both paginated and non-paginated responses.
      const results = Array.isArray(data) ? data : data?.results || [];
      const totalCount = Array.isArray(data)
        ? data.length
        : data?.count ?? results.length;

      setTickets(results);
      setCount(totalCount);
    } catch (err) {
      console.error("Failed to load support tickets", err);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (event) => {
    event.preventDefault();
    setCreateError("");

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || !trimmedMessage) {
      setCreateError("Subject and message are required.");
      return;
    }

    try {
      setCreating(true);
      await createJobseekerTicket({
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      setSubject("");
      setMessage("");
      setPage(1);
      await fetchTickets();
    } catch (err) {
      console.error("Failed to create support ticket", err);
      setCreateError("Failed to create ticket.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="text-sm text-gray-600">
          Create and manage your support tickets.
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Create Ticket</h2>

        <form onSubmit={handleCreateTicket} className="space-y-3">
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            placeholder="Describe your issue..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={creating}
            className={`px-4 py-2 text-sm rounded-lg ${
              creating
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {creating ? "Creating..." : "Create Ticket"}
          </button>

          {createError && <p className="text-sm text-red-600">{createError}</p>}
        </form>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={fetchTickets}
            className="h-10 px-4 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-3">
            {error}
          </div>
        )}

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Created</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-700">{ticket.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {ticket.subject || "Untitled ticket"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === "closed"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.status || "open"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {ticket.created_at ? formatDateTime(ticket.created_at) : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => navigate(`/profile/support/${ticket.id}`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && tickets.length === 0 && (
          <p className="text-sm text-gray-500 mt-3">No tickets found.</p>
        )}
        {loading && (
          <p className="text-sm text-gray-500 mt-3">Loading tickets...</p>
        )}

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </section>
    </div>
  );
}
