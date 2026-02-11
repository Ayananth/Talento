import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ResponsiveTable from "@/components/admin/ResponsiveTable";
import Pagination from "@/components/common/Pagination";
import { getAdminTickets } from "@/apis/admin/supportTickets";
import { PAGE_SIZE } from "@/constants/constants";
import { formatDateTime } from "@/utils/common/utils";

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

function resolveTicketUser(ticket) {
  if (!ticket) return "—";
  if (typeof ticket.user === "string") return ticket.user;
  if (ticket.user_email) return ticket.user_email;
  if (ticket.user_name) return ticket.user_name;
  if (ticket.user?.email) return ticket.user.email;
  if (ticket.user?.username) return ticket.user.username;
  if (ticket.user?.id) return `User #${ticket.user.id}`;
  if (ticket.user) return String(ticket.user);
  return "—";
}

export default function AdminTicketsPage() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState("-created_at");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = Math.ceil(count / Number(PAGE_SIZE || 10));

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminTickets({
        page,
        ordering,
        status: statusFilter,
      });

      // Support both paginated and non-paginated responses.
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
  }, [page, ordering, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSort = (key) => {
    // Cycle through asc -> desc -> none.
    if (ordering === key) setOrdering(`-${key}`);
    else if (ordering === `-${key}`) setOrdering("");
    else setOrdering(key);

    setPage(1);
  };

  const tableRows = useMemo(
    () =>
      tickets.map((ticket) => ({
        id: ticket.id,
        subject: ticket.subject || "Untitled ticket",
        status: ticket.status || "open",
        user: resolveTicketUser(ticket),
        created_at: ticket.created_at,
        raw: ticket,
      })),
    [tickets]
  );

  const columns = [
    {
      label: "ID",
      key: "id",
      sortable: true,
      orderingKey: "id",
    },
    {
      label: "Subject",
      key: "subject",
      sortable: true,
      orderingKey: "subject",
    },
    {
      label: "Status",
      key: "status",
      sortable: true,
      orderingKey: "status",
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === "closed"
              ? "bg-gray-100 text-gray-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      label: "User",
      key: "user",
    },
    {
      label: "Created",
      key: "created_at",
      sortable: true,
      orderingKey: "created_at",
      render: (row) =>
        row.created_at ? formatDateTime(row.created_at) : "—",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <p className="text-sm text-gray-600 mt-1">
          Track and manage all support conversations.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
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
          className="h-10 px-4 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}


      <ResponsiveTable
        data={tableRows}
        columns={columns}
        rowKey="id"
        ordering={ordering}
        onSort={handleSort}
        actions={(row) => (
          <button
            onClick={() => navigate(`/admin/tickets/${row.id}`)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View
          </button>
        )}
      />

      {!loading && tableRows.length === 0 && (
        <div className="text-sm text-gray-500">No support tickets found.</div>
      )}

      {loading && (
        <div className="text-sm text-gray-500">Loading support tickets...</div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
