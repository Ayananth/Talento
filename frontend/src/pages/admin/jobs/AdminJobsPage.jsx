import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminJobs } from "@/apis/admin/jobs";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE } from "@/constants/constants";
import { formatDateTime } from "@/utils/common/utils";

export default function AdminJobsPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [ordering, setOrdering] = useState("");
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();
  const totalPages = Math.ceil(count / PAGE_SIZE);

  /* ---------------------------------------------------
     FETCH JOBS
  --------------------------------------------------- */
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAdminJobs({page, ordering, company, status:statusFilter} );

      const mapped = res.results.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        email: job.email,
        status: job.status,
        published_at: job.published_at,
        expires_at: job.expires_at,
        raw: job,
      }));

      setData(mapped);
      setCount(res.count);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, ordering, company, statusFilter]);

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
     TABLE COLUMNS
  --------------------------------------------------- */
  const columns = [
    {
      label: "No",
      key: "number",
      render: (_, index) => (page - 1) * PAGE_SIZE + index + 1,
    },
    {
      label: "Job Title",
      key: "title",
      sortable: true,
      orderingKey: "title",
    },
    {
      label: "Company",
      key: "company",
      sortable: true,
      orderingKey: "recruiter__recruiter_profile__company_name",
    },
    {
      label: "Recruiter Email",
      key: "email",
      sortable: true,
        orderingKey: "recruiter__email",
    },
    {
      label: "Status",
      key: "status",
      sortable: true,
      orderingKey: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium
            ${
              row.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      label: "Published At",
      key: "published_at",
      sortable: true,
      orderingKey: "published_at",
      render: (row) =>
        row.published_at ? formatDateTime(row.published_at) : "—",
    },
    {
      label: "Expires At",
      key: "expires_at",
      sortable: true,
      orderingKey: "expires_at",
      render: (row) =>
        row.expires_at ? formatDateTime(row.expires_at) : "—",
    },
  ];

  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Jobs
      </h2>

{/* FILTER TOOLBAR */}
<div className="mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3
                flex flex-col md:flex-row md:items-center gap-3">

  {/* SEARCH */}
  <div className="flex-1 relative">
    <input
      type="text"
      placeholder="Search  by company"
      value={company}
      onChange={(e) => {
        setCompany(e.target.value);
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
    <option value="published">Published</option>
    <option value="draft">Draft</option>
    <option value="closed">Closed</option>
  </select>


  {/* CLEAR */}
  {(company || statusFilter) && (
    <button
      onClick={() => {
        setCompany("");
        setStatusFilter("");

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
            onClick={() => navigate(`/admin/jobs/${row.id}`)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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

      {loading && (
        <div className="mt-4 text-gray-500 text-sm">
          Loading jobs…
        </div>
      )}
    </div>
  );
}
