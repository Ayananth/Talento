import React, { useState, useMemo, useEffect } from "react";
import { getPendingList } from "./apis/getPendingList";
import useAuth from "../../auth/context/useAuth";

export default function PendingApprovalsPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([])
  const pageSize = 5;
  const { loading: authLoading } = useAuth()  
  

  useEffect(() => {
    if (authLoading) return;  

    const fetchData = async () => {
      try {
        const response = await getPendingList();
        const mapped = response.results.map((item) => ({
          id: item.id,
          user: item.username,
          company: item.company_name,
          status: item.status,
          mode: item.request_type?.toLowerCase(),
          submitted: item.updated_at,
        }));
        setData(mapped);
      } catch (error) {
        console.error("API ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading]);




  // const data = [
  //   { id: 1, user: "Arun", company: "TechCorp", role: "Recruiter", status: "pending", mode: "new", submitted: "2025-02-10" },
  //   { id: 2, user: "Meera", company: "Softify", role: "HR", status: "approved", mode: "edit", submitted: "2025-02-08" },
  //   { id: 3, user: "Kiran", company: "Innotech", role: "Recruiter", status: "rejected", mode: "new", submitted: "2025-02-05" },
  //   { id: 4, user: "Divya", company: "CodeVista", role: "Admin", status: "pending", mode: "edit", submitted: "2025-02-06" },
  // ];

const filtered = useMemo(() => {
  let filteredData = data;

  if (search) {
    const q = search.toLowerCase();
    filteredData = filteredData.filter((item) =>
      (item.user || "").toLowerCase().includes(q) ||
      (item.company || "").toLowerCase().includes(q)
    );
  }

  if (statusFilter !== "all") {
    filteredData = filteredData.filter((item) => item.status === statusFilter);
  }

  if (sortColumn) {
    filteredData = [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  return filteredData;
}, [data, search, statusFilter, sortColumn, sortOrder]);


  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortOrder("asc");
    }
  };

if (loading) {
  return (
    <div className="p-10 text-center text-lg text-gray-600">
      Loading pending approvals...
    </div>
  );
}


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Approvals</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          className="px-4 py-2 border rounded-lg w-64"
          placeholder="Search user or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {[
  { label: "No", col: "id" },
  { label: "User", col: "user" },
  { label: "Company", col: "company" },
  { label: "Status", col: "status" },
  { label: "Request Type", col: "mode" },
  { label: "Submitted", col: "submitted" },
  { label: "View", col: null },
].map((head, index) => (
                <th
                  key={index}
                  className="px-4 py-3 cursor-pointer select-none"
                  onClick={() => head.col && toggleSort(head.col)}
                >
                  {head.label} {sortColumn === head.col ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.map((item, idx) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{item.id}</td>
              <td className="px-4 py-2">{item.user}</td>
              <td className="px-4 py-2">{item.company}</td>

              <td className="px-4 py-2">
                <span
                  className={`${item.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : item.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    } px-3 py-1 rounded-md font-semibold capitalize`}
                >
                  {item.status}
                </span>
              </td>

              <td className="px-4 py-2">
                <span
                  className={`${item.mode === "new"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                    } px-3 py-1 rounded-md font-semibold capitalize`}
                >
                  {item.mode}
                </span>
              </td>

              <td className="px-4 py-2">{item.submitted}</td>

              <td className="px-4 py-2">
                <button className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  View
                </button>
              </td>
            </tr>

            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          className="px-3 py-1 border rounded-lg"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span className="font-medium">Page {page} of {totalPages}</span>

        <button
          className="px-3 py-1 border rounded-lg"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
