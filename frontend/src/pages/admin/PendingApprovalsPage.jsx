import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getPendingList } from "@/apis/admin/getPendingList";
import useAuth from "@/auth/context/useAuth";
import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE } from "@/constants/constants";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import Toast from "../../components/common/Toast";


export default function PendingApprovalsPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("");

  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState(null);

  const totalPages = Math.ceil(count / PAGE_SIZE);


  const fetchData = async (pageNum) => {
    try {
      const response = await getPendingList({
        page: pageNum,
        ordering,
        search,
        status: statusFilter,
        request_type: requestTypeFilter,
      });

      const mapped = response.results.map((item) => ({
        id: item.id,
        user: item.username,
        company: item.company_name || item.pending_data?.company_name,
        status: item.status?.toUpperCase(),
        request_type: item.request_type?.toUpperCase() || "NEW",
        submitted: new Date(item.updated_at).toLocaleString(),
      }));

      setData(mapped);
      setCount(response.count);
    } catch (err) {
      console.error("Failed to fetch pending approvals", err);
    }
  };


  useEffect(() => {
    if (!authLoading) fetchData(page);
  }, [
    authLoading,
    page,
    ordering,
    search,
    statusFilter,
    requestTypeFilter,
  ]);


  const handleSort = (orderingKey) => {
    if (!orderingKey) return;

    if (ordering === orderingKey) {
      setOrdering(`-${orderingKey}`);
    } else if (ordering === `-${orderingKey}`) {
      setOrdering("");
    } else {
      setOrdering(orderingKey);
    }

    setPage(1);
  };


useEffect(() => {
  if (location.state?.toast) {
    setToast(location.state.toast);

    // Clear router state so it doesn't reappear on refresh
    window.history.replaceState({}, document.title);

    const timer = setTimeout(() => {
      setToast(null);
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [location.state]);



  const columns = [
    {
      label: "No",
      key: "number",
      render: (_, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      label: "User",
      key: "user",
      sortable: true,
      orderingKey: "user__username",
    },
    {
      label: "Company",
      key: "company",
      sortable: true,
      orderingKey: "company_name",
    },
    {
      label: "Request Type",
      key: "request_type",
      render: (row) => {
        const styles = {
          NEW: "bg-blue-100 text-blue-800 border border-blue-200",
          EDIT: "bg-purple-100 text-purple-800 border border-purple-200",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              styles[row.request_type] || "bg-gray-100 text-gray-800"
            }`}
          >
            {row.request_type}
          </span>
        );
      },
    },

    {
      label: "Submitted",
      key: "submitted",
      sortable: true,
      orderingKey: "updated_at",
    },
  ];


  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Pending Approvals
      </h2>

      {toast && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium
            ${toast.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"}
          `}
        >
          {toast.message}
        </div>
      )}

      {/* FILTER TOOLBAR */}
      <div className="mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3
                      flex flex-col md:flex-row md:items-center gap-3">

        {/* SEARCH */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by username or company"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 pl-9 pr-3 text-sm border border-gray-300
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>



        {/* REQUEST TYPE */}
        <select
          value={requestTypeFilter}
          onChange={(e) => {
            setRequestTypeFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="">All Requests</option>
          <option value="new">New</option>
          <option value="edit">Edit</option>
        </select>

        {/* CLEAR */}
        {(search || statusFilter || requestTypeFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setRequestTypeFilter("");
              setPage(1);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            Clear
          </button>
        )}
      </div>

      <ResponsiveTable
        data={data}
        columns={columns}
        rowKey="id"
        ordering={ordering}
        onSort={handleSort}
        actions={(row) => (
          <button
            onClick={() => navigate(`${row.id}`)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View
          </button>
        )}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
