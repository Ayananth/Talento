import React, { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import { PAGE_SIZE } from "@/constants/constants";
import { Download } from "lucide-react";
import {
  getTransactions,
  getTransactionRevenueSummary,
} from "../../../apis/admin/getTransactions";
import api from "@/apis/api";




export default function SubscriptionTransactionsPage() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  const [fromDate, setFromDate] = useState(getStartOfYear());
  const [toDate, setToDate] = useState(getToday());
  const [activeRange, setActiveRange] = useState("this_year");
  const [revenue, setRevenue] = useState({
    jobseeker_revenue: 0,
    recruiter_revenue: 0,
    total_revenue: 0,
  });

  const totalPages = Math.ceil(count / PAGE_SIZE);


  /* ---------------- Fetch ---------------- */

  const fetchData = async (pageNum) => {
    try {
      const response = await getTransactions({
        page: pageNum,
        ordering,
        status: statusFilter,
        plan_type: planFilter,
        from_date: fromDate,
        to_date: toDate,
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

  const fetchRevenueSummary = async () => {
    try {
      const summary = await getTransactionRevenueSummary({
        from_date: fromDate,
        to_date: toDate,
      });

      console.log(summary)

      setRevenue({
        jobseeker_revenue: summary?.jobseeker_revenue ?? 0,
        recruiter_revenue: summary?.recruiter_revenue ?? 0,
        total_revenue: summary?.total_revenue ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch revenue summary", err);
    }
  };

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    fetchData(page);
  }, [page, ordering, statusFilter, planFilter, fromDate, toDate]);

  useEffect(() => {
    fetchRevenueSummary();
  }, [fromDate, toDate]);

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

  /* ---------------- Export ---------------- */


const handleExport = async () => {
  try {
    const params = {
      ...(statusFilter && { status: statusFilter }),
      ...(planFilter && { plan_type: planFilter }),
      ...(fromDate && { from_date: fromDate }),
      ...(toDate && { to_date: toDate }),
      ...(ordering && { ordering }),
    };

    const response = await api.get(
      "/v1/admin/transactions/export/",
      {
        params,
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed", err);
  }
};


  /* ---------------- Columns ---------------- */

  const columns = [
    {
      label: "No",
      key: "number",
      render: (_, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    { label: "Transaction ID", key: "transaction_id" },
    {
      label: "User",
      key: "user_name",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.user_name || "-"}</div>
          <div className="text-sm text-gray-500">{row.user_email}</div>
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
          EXPIRED: "bg-gray-100 text-gray-700 border border-gray-200",
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
        <span className="capitalize text-sm text-gray-600">{row.user_type}</span>
      ),
    },
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Subscription Transactions
      </h2>

      {/* REVENUE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <RevenueCard
          label="Jobseeker Revenue"
          value={revenue.jobseeker_revenue}
          tone="blue"
        />
        <RevenueCard
          label="Recruiter Revenue"
          value={revenue.recruiter_revenue}
          tone="emerald"
        />
        <RevenueCard
          label="Total Revenue"
          value={revenue.total_revenue}
          tone="violet"
        />
      </div>

      {/* QUICK DATE RANGES */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            const { from, to } = getThisYearRange();
            setFromDate(from);
            setToDate(to);
            setActiveRange("this_year");
            setPage(1);
          }}
          className={getRangeBtnClass(activeRange === "this_year")}
        >
          This Year
        </button>
        <button
          onClick={() => {
            const { from, to } = getLastYearRange();
            setFromDate(from);
            setToDate(to);
            setActiveRange("last_year");
            setPage(1);
          }}
          className={getRangeBtnClass(activeRange === "last_year")}
        >
          Last Year
        </button>
        <button
          onClick={() => {
            const { from, to } = getThisMonthRange();
            setFromDate(from);
            setToDate(to);
            setActiveRange("this_month");
            setPage(1);
          }}
          className={getRangeBtnClass(activeRange === "this_month")}
        >
          This Month
        </button>
        <button
          onClick={() => {
            const { from, to } = getLast30DaysRange();
            setFromDate(from);
            setToDate(to);
            setActiveRange("last_30_days");
            setPage(1);
          }}
          className={getRangeBtnClass(activeRange === "last_30_days")}
        >
          Last 30 Days
        </button>
      </div>

      {/* FILTER + EXPORT TOOLBAR */}
      <div
        className="mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3
                   flex flex-col lg:flex-row lg:items-center lg:justify-end gap-3"
      >
        {/* FROM DATE */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setActiveRange("custom");
            setPage(1);
          }}
          className="h-9 px-3 text-sm border border-gray-300 rounded-lg"
        />

        {/* TO DATE */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setActiveRange("custom");
            setPage(1);
          }}
          className="h-9 px-3 text-sm border border-gray-300 rounded-lg"
        />

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

        {/* USER TYPE */}
        <select
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
        >
          <option value="">User Type</option>
          <option value="jobseeker">Jobseeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        {/* EXPORT */}
        <button
          onClick={handleExport}
          className="h-9 px-4 bg-blue-600 text-white text-sm
                     rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Download size={16} />
          Export
        </button>

        {/* CLEAR */}
        {(statusFilter || planFilter || fromDate || toDate) && (
          <button
            onClick={() => {
              setStatusFilter("");
              setPlanFilter("");
              setFromDate(getStartOfYear());
              setToDate(getToday());
              setActiveRange("this_year");
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


const getStartOfYear = () => {
  const now = new Date();
  return `${now.getFullYear()}-01-01`;
};

const getToday = () => {
  return formatLocalDate(new Date());
};

const formatLocalDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getThisYearRange = () => {
  const now = new Date();
  return {
    from: `${now.getFullYear()}-01-01`,
    to: getToday(),
  };
};

const getLastYearRange = () => {
  const now = new Date();
  const year = now.getFullYear() - 1;
  return {
    from: `${year}-01-01`,
    to: `${year}-12-31`,
  };
};

const getThisMonthRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    from: formatLocalDate(first),
    to: getToday(),
  };
};

const getLast30DaysRange = () => {
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - 29);
  return {
    from: formatLocalDate(from),
    to: formatLocalDate(now),
  };
};

const getRangeBtnClass = (active) =>
  `px-3 py-1.5 text-sm rounded-lg border transition ${
    active
      ? "bg-blue-600 text-white border-blue-600"
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
  }`;

function RevenueCard({ label, value, tone = "blue" }) {
  const toneClasses = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    violet: "bg-violet-50 border-violet-100 text-violet-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1">₹{value || 0}</p>
    </div>
  );
}
