import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { getTransactions } from "../../../apis/admin/getTransactions";

const SubscriptionTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      setTransactions(response.results || []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- Helpers ---------------- */

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getPlanBadge = (plan) => {
    const styles = {
      Starter: "bg-blue-100 text-blue-800",
      Pro: "bg-purple-100 text-purple-800",
      Elite: "bg-indigo-100 text-indigo-800",
    };
    return styles[plan] || "bg-gray-100 text-gray-800";
  };

  /* ---------------- Filters ---------------- */

  const filteredTransactions = transactions.filter((txn) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      txn.transaction_id?.toLowerCase().includes(search) ||
      txn.user_email?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || txn.status === statusFilter;

    const matchesPlan =
      planFilter === "all" || txn.plan_name === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscription Transactions
          </h1>
          <p className="text-gray-600">
            Manage and track all subscription payments
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by email or transaction ID..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <select
                className="px-4 py-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <select
                className="px-4 py-2 border rounded-lg"
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <option value="all">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {[
                    "Transaction ID",
                    "User",
                    "Plan",
                    "Amount",
                    "Status",
                    "Date",
                    "User Type",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10">
                      Loading...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => (
                    <tr
                      key={txn.transaction_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium">
                        {txn.transaction_id || "-"}
                      </td>

                      <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{txn.user_name}</div>
                      <div className="text-sm text-gray-500">{txn.user_email}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getPlanBadge(
                            txn.plan_name
                          )}`}
                        >
                          {txn.plan_name}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {txn.duration_months} Month(s)
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ₹{txn.amount}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(txn.status)}
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              txn.status
                            )}`}
                          >
                            {txn.status}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(txn.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>

                      <td className="px-6 py-4 capitalize text-sm text-gray-500">
                        {txn.user_type}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {filteredTransactions.length}
          </span>{" "}
          of{" "}
          <span className="font-medium">
            {transactions.length}
          </span>{" "}
          transactions
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTransactions;
