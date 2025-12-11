import React, { useState, useEffect } from "react";
import { getPendingList } from "./apis/getPendingList";
import useAuth from "../../auth/context/useAuth";
import Pagination from "../../../shared/components/Pagination";
import { PAGE_SIZE } from "../../../shared/constants/constants";
import ResponsiveTable from "../components/ResponsiveTable";

export default function PendingApprovalsPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = PAGE_SIZE;
  const totalPages = Math.ceil(count / pageSize);
  const { loading: authLoading } = useAuth();

  const fetchData = async (pageNum) => {
    const response = await getPendingList(pageNum);

    const mapped = response.results.map((item) => ({
      id: item.id,
      user: item.username,
      company: item.company_name,
      status: item.status,
      mode: item.request_type?.toLowerCase(),
      submitted: new Date(item.updated_at).toLocaleString(),
    }));

    setData(mapped);
    setCount(response.count);
  };

  useEffect(() => {
    if (!authLoading) fetchData(page);
  }, [authLoading, page]);

  const columns = [
    {
      label: "No",
      key: "number",
      render: (_, index) => (page - 1) * pageSize + index + 1,
    },
    { label: "User", key: "user" },
    { label: "Company", key: "company" },

    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
            row.status === "approved"
              ? "bg-green-100 text-green-700"
              : row.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}>
          {row.status}
        </span>
      ),
    },
    {
      label: "Request",
      key: "mode",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
            row.mode === "new"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}>
          {row.mode}
        </span>
      ),
    },
    { label: "Submitted", key: "submitted" },
  ];

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Pending Approvals
      </h2>

      <ResponsiveTable
        data={data}
        columns={columns}
        rowKey="id"
        actions={(row) => (
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            View
          </button>
        )}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(num) => setPage(num)}
      />
    </div>
  );
}