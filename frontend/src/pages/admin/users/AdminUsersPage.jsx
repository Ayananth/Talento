import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminUsers } from "@/apis/admin/users";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE } from "@/constants/constants";

export default function AdminUsersPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const totalPages = Math.ceil(count / PAGE_SIZE);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers(page, ordering);

      const mapped = res.results.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username || "—",
        role: u.role_display,
        status: u.is_active ? "Active" : "Blocked",
        verified: u.is_email_verified ? "Yes" : "No",
        raw: u, // keep full object
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

  const handleSort = (key) => {
    if (ordering === key) {
      setOrdering(`-${key}`);
    } else if (ordering === `-${key}`) {
      setOrdering("");
    } else {
      setOrdering(key);
    }
    setPage(1);
  };

  const columns = [
    {
      label: "No",
      key: "number",
      render: (_, index) => (page - 1) * PAGE_SIZE + index + 1,
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
      orderingKey: "is_active",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium
            ${
              row.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      label: "Email Verified",
      key: "verified",
    },
  ];

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
              onClick={() =>
                alert(
                  row.status === "Active"
                    ? "Block user (API next step)"
                    : "Unblock user (API next step)"
                )
              }
              className={`px-3 py-1 text-sm rounded text-white
                ${
                  row.status === "Active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {row.status === "Active" ? "Block" : "Unblock"}
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
    </div>
  );
}
