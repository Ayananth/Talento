import React, { useState, useEffect } from "react";
import { getPendingList } from "./apis/getPendingList";
import useAuth from "../../auth/context/useAuth";
import Pagination from "../../../shared/components/Pagination";
import { PAGE_SIZE } from "../../../shared/constants/constants";


export default function PendingApprovalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0); // total rows from backend
  const pageSize = PAGE_SIZE; // keep in sync with backend
  const totalPages = Math.ceil(count / pageSize);

  const { loading: authLoading } = useAuth();

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
      setCount(response.count ?? 0);
    } catch (error) {
      console.error("API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchData(page);
  }, [authLoading, page]);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg text-gray-600">
        Loading pending approvals...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Approvals</h2>

      {/* Responsive wrapper */}
      <div className="w-full bg-white shadow rounded-xl">
        {/* Desktop / Tablet: regular table (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-fixed text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 w-12">No</th>
                <th className="px-4 py-3 w-40">User</th>
                <th className="px-4 py-3 w-40">Company</th>
                <th className="px-4 py-3 w-32">Status</th>
                <th className="px-4 py-3 w-32">Request Type</th>
                <th className="px-4 py-3 w-48">Submitted</th>
                <th className="px-4 py-3 w-20">View</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 align-top">{item.id}</td>

                  {/* use min-w-0 on the cell container so truncate works inside flex/td */}
                  <td className="px-4 py-3 align-top min-w-0">
                    <div className="truncate max-w-[10rem]">{item.user}</div>
                  </td>

                  <td className="px-4 py-3 align-top min-w-0">
                    <div className="break-words max-w-[36rem]">{item.company}</div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <span
                      className={`${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      } px-3 py-1 rounded-md font-semibold capitalize inline-block`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <span
                      className={`${
                        item.mode === "new"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      } px-3 py-1 rounded-md font-semibold capitalize inline-block`}
                    >
                      {item.mode}
                    </span>
                  </td>

                  <td className="px-4 py-3 align-top">
                    {new Date(item.submitted).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 align-top">
                    <button className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden">
          <ul className="space-y-3 p-3">
            {data.map((item) => (
              <li
                key={item.id}
                className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {item.user} <span className="text-sm text-gray-500">• #{item.id}</span>
                      </h3>
                      <div>
                        <button className="px-2 py-1 rounded bg-blue-600 text-white text-sm">
                          View
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-600 break-words">
                      <span className="font-medium text-gray-700">Company: </span>
                      <span className="text-gray-800">{item.company}</span>
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold capitalize ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold capitalize ${
                          item.mode === "new"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.mode}
                      </span>

                      <span className="text-xs text-gray-500">
                        {new Date(item.submitted).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={(n) => setPage(n)} />
    </div>
  );
}
