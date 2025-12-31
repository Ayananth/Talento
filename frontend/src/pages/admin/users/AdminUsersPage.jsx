import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminUsers } from "@/apis/admin/users";
import { toggleUserBlock } from "@/apis/admin/users";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE_TABLES as PAGE_SIZE } from "@/constants/constants";

/* ---------------------------------------------------
   CONFIRMATION MODAL
--------------------------------------------------- */
function ConfirmModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded text-white
              ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
          >
            {loading ? "Please wait…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   MAIN PAGE
--------------------------------------------------- */
export default function AdminUsersPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState("");
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();
  const totalPages = Math.ceil(count / PAGE_SIZE);

  /* ---------------------------------------------------
     FETCH USERS
  --------------------------------------------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers(page, ordering);

      res.results.map((u)=> console.log(u));

      const mapped = res.results.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username || "—",
        role: u.role_display,
        is_blocked: u.is_blocked,
        status: u.is_blocked ? "Blocked" : "Active",
        verified: u.is_email_verified ? "Yes" : "No",
        raw: u,
      }));

      setData(mapped);
      setCount(res.count);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, ordering]);

  /* ---------------------------------------------------
     SORTING
  --------------------------------------------------- */
  const handleSort = (key) => {
    if (ordering === key) setOrdering(`-${key}`);
    else if (ordering === `-${key}`) setOrdering("");
    else setOrdering(key);

    setPage(1);
  };

  /* ---------------------------------------------------
     BLOCK / UNBLOCK CONFIRM
  --------------------------------------------------- */
  const handleConfirmBlock = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);

      await toggleUserBlock(
        selectedUser.id,
        !selectedUser.is_blocked
      );

      setConfirmOpen(false);
      setSelectedUser(null);

      fetchUsers();
    } catch (err) {
      console.error("Failed to update user status", err);
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------------------------------------------
     TABLE COLUMNS
  --------------------------------------------------- */
  const columns = [
    {
      label: "No",
      key: "number",
render: (_, index) =>
  (page - 1) * data.length + index + 1
    },
    {
      label: "Email",
      key: "email",
      sortable: true,
      orderingKey: "email",
    },
    {
      label: "Username",
      key: "username",
      sortable: true,
      orderingKey: "username",
    },
    {
      label: "Role",
      key: "role",
      sortable: true,
      orderingKey: "role",
    },
    {
      label: "Status",
      key: "status",
      sortable: true,
      orderingKey: "is_blocked",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium
            ${
              row.is_blocked
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
        >
          {row.is_blocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      label: "Email Verified",
      key: "verified",
      sortable: true,
    },
  ];

console.log("data: ",data)
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Users
      </h2>

      <ResponsiveTable
        data={data}
        columns={columns}
        rowKey="id"
        ordering={ordering}
        onSort={handleSort}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/users/${row.id}`)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View
            </button>

            <button
              onClick={() => {
                setSelectedUser(row);
                setConfirmOpen(true);
              }}
              className={`px-3 py-1 text-sm rounded text-white
                ${
                  row.is_blocked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
            >
              {row.is_blocked ? "Unblock" : "Block"}
            </button>
          </div>
        )}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {loading && (
        <div className="mt-4 text-gray-500 text-sm">
          Loading users…
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) {
            setConfirmOpen(false);
            setSelectedUser(null);
          }
        }}
        onConfirm={handleConfirmBlock}
        title={
          selectedUser?.is_blocked
            ? "Unblock User"
            : "Block User"
        }
        description={
          selectedUser?.is_blocked
            ? "Are you sure you want to unblock this user?"
            : "Are you sure you want to block this user? They will be logged out immediately."
        }
      />
    </div>
  );
}
