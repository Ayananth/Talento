import React, { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import { PAGE_SIZE } from "@/constants/constants";

import {getTransactions} from "../../../apis/admin/getTransactions"

export default function SubscriptionTransactionsPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  const totalPages = Math.ceil(count / PAGE_SIZE);

  /* ---------------- Fetch ---------------- */

  const fetchData = async (pageNum) => {
    try {
      const response = await getTransactions({
        page: pageNum,
        ordering,
        search,
        status: statusFilter,
        plan_type: planFilter,
      });

      const mapped = response.results.map((item) => ({
        id: item.id,
        transaction_id: item.transaction_id,
        user_name: item.user_name,
        user_email: item.user_email,
        user_type: item.user_type,
        plan_name: item.plan_name,
        duration: `${item.duration_months} Month(s)`,
        amount: `₹${item.amount}`,
        status: item.status.toUpperCase(),
        created_at: new Date(item.created_at).toLocaleDateString("en-IN"),
      }));

      setData(mapped); 
      setCount(response.count);
    } catch (err) {
      console.error(err);
    }
  };


  /* ---------------- Effects ---------------- */

  useEffect(() => {
    fetchData(page);
  }, [page, ordering, search, statusFilter, planFilter]);

  /* ---------------- Sorting ---------------- */

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

  /* ---------------- Columns ---------------- */

  const columns = [
    {
      label: "No",
      key: "number",
      render: (_, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      label: "Transaction ID",
      key: "transaction_id",
    },
    {
      label: "User",
      key: "user_name",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.user_name || "-"}
          </div>
          <div className="text-sm text-gray-500">
            {row.user_email}
          </div>
        </div>
      ),
    },
    {
      label: "Plan",
      key: "plan_name",
      sortable: true,
      orderingKey: "plan__name",
      render: (row) => (
        <div>
          <div className="font-medium">{row.plan_name}</div>
          <div className="text-xs text-gray-500">{row.duration}</div>
        </div>
      ),
    },
    {
      label: "Amount",
      key: "amount",
      sortable: true,
      orderingKey: "plan__price",
    },
    {
      label: "Status",
      key: "status",
      sortable: true,
      orderingKey: "status",
      render: (row) => {
        const styles = {
          ACTIVE: "bg-green-100 text-green-800 border border-green-200",
          PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          FAILED: "bg-red-100 text-red-800 border border-red-200",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              styles[row.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      label: "Date",
      key: "created_at",
      sortable: true,
      orderingKey: "created_at",
    },
    {
      label: "User Type",
      key: "user_type",
      render: (row) => (
        <span className="capitalize text-sm text-gray-600">
          {row.user_type}
        </span>
      ),
    },
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Subscription Transactions
      </h2>

      {/* FILTER TOOLBAR */}
      <div className="mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3
                      flex flex-col md:flex-row md:items-center gap-3">

        {/* SEARCH */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by email or transaction ID"
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

        {/* STATUS */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        {/* PLAN TYPE */}
        <select
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="">User type</option>
          <option value="jobseeker">Jobseeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        {/* CLEAR */}
        {(search || statusFilter || planFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setPlanFilter("");
              setPage(1);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* TABLE */}
      <ResponsiveTable
        data={data}
        columns={columns}
        rowKey="id"
        ordering={ordering}
        onSort={handleSort}
      />

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
