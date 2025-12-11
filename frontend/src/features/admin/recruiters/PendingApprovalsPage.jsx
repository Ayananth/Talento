import React, { useState, useEffect } from "react";
import { getPendingList } from "./apis/getPendingList";
import useAuth from "../../auth/context/useAuth";
import Pagination from "../../../shared/components/Pagination";
import { PAGE_SIZE } from "../../../shared/constants/constants";


export default function PendingApprovalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0); // total rows
  const pageSize = PAGE_SIZE;

  const { loading: authLoading } = useAuth();

  const totalPages = Math.ceil(count / pageSize);

  const fetchData = async (pageNum) => {
    setLoading(true);
    try {
      const response = await getPendingList(pageNum);

      const mapped = response.results.map((item) => ({
        id: item.id,
        user: item.username,
        company: item.company_name,
        status: item.status,
        mode: item.request_type?.toLowerCase(),
        submitted: item.updated_at,
      }));

      setData(mapped);
      setCount(response.count); //total rows from backedn
    } catch (error) {
      console.error("API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData(page);
    }
  }, [authLoading, page]);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg text-gray-600">
        Loading pending approvals...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Pending Approvals
      </h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Request Type</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">View</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.user}</td>
                <td className="px-4 py-2">{item.company}</td>

                <td className="px-4 py-2">
                  <span
                    className={`${
                      item.status === "approved"
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
                    className={`${
                      item.mode === "new"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    } px-3 py-1 rounded-md font-semibold capitalize`}
                  >
                    {item.mode}
                  </span>
                </td>

                <td className="px-4 py-2">
                  {new Date(item.submitted).toLocaleString()}
                </td>

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

      {/* Pagination Component */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(num) => setPage(num)}
      />
    </div>
  );
}
