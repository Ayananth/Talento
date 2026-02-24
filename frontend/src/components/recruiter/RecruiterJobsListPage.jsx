import ResponsiveTable from "@/components/recruiter/ResponsiveTable";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRecruiterJobs, deleteJob } from "@/apis/recruiter/apis";
import ConfirmModal from "../common/ConfirmModal";
import Toast from "@/components/common/Toast";
import Pagination from "../common/Pagination";
import { PAGE_SIZE } from "../../constants/constants";

export default function RecruiterJobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [ordering, setOrdering] = useState("-created_at");
  const [loading, setLoading] = useState(true);

  const [deleteJobId, setDeleteJobId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const totalPages = Math.ceil(count / PAGE_SIZE);

  /* ---------------------------------------------------
     FETCH JOBS
  --------------------------------------------------- */
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await getRecruiterJobs({
        page,
        ordering,
        status: statusFilter,
      });

      const mapped = res.results.map((job) => ({
        id: job.id,
        title: job.title,
        status: job.status,
        applications_count: job.applications_count ?? 0,
        view_count: job.view_count ?? 0,
        expires_at: job.expires_at,
        is_active: job.is_active,
        location_city: job.location_city,
        location_state: job.location_state,
        location_country: job.location_country,
      }));

      setJobs(mapped);
      setCount(res.count);
    } catch (err) {
      console.error("Failed to load recruiter jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [ordering, page, statusFilter]);

  useEffect(() => {
    const toastFromState = location.state?.toast;
    if (!toastFromState) return;

    setToast(toastFromState);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  /* ---------------------------------------------------
     DELETE JOB
  --------------------------------------------------- */
  const handleDeleteJob = async () => {
    try {
      setDeleteLoading(true);
      await deleteJob(deleteJobId);

      setDeleteJobId(null);
      await fetchJobs();

      setToast({
        type: "success",
        message: "Job deleted successfully",
      });
    } catch (err) {
      console.error("Failed to delete job", err);
      setDeleteJobId(null);
      setToast({
        type: "error",
        message: "Failed to delete job",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ---------------------------------------------------
     TABLE COLUMNS
  --------------------------------------------------- */
  const columns = [
    {
      label: "Title",
      key: "title",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500 capitalize">{row.status}</p>
        </div>
      ),
    },
    {
      label: "Applicants",
      key: "applications_count",
      sortable: true,
    },
    {
      label: "Views",
      key: "view_count",
      sortable: true,
    },
    {
      label: "Expiry Date",
      key: "expires_at",
      sortable: true,
      render: (row) =>
        row.expires_at ? (
          <span>{new Date(row.expires_at).toLocaleDateString()}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      label: "Location",
      key: "location",
      render: (row) =>
        [row.location_city, row.location_state, row.location_country]
          .filter(Boolean)
          .join(", "),
    },
    {
      label: "Active",
      key: "is_active",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.is_active ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  /* ---------------------------------------------------
     ACTIONS
  --------------------------------------------------- */
  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/recruiter/jobs/${row.id}`)}
        className="text-blue-600 text-sm hover:underline"
      >
        View
      </button>

      <button
        disabled={!row.is_active || row.status === "closed"}
        onClick={() => setDeleteJobId(row.id)}
        className={`text-sm ${
          row.is_active && row.status !== "closed"
            ? "text-red-600 hover:underline"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        Close
      </button>
    </div>
  );

  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Jobs</h1>

        {/* <button
          onClick={() => navigate("/recruiter/jobs/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Post New Job
        </button> */}
      </div>

      {/* FILTER BAR */}
{/* FILTER + ACTION ROW */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

  {/* LEFT: FILTER */}
  <div className="flex items-center gap-3">
    <select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setPage(1);
      }}
      className="h-9 px-3 text-sm border border-gray-300 rounded-lg bg-white"
    >
      <option value="">All Status</option>
      <option value="draft">Draft</option>
      <option value="published">Published</option>
      <option value="closed">Closed</option>
    </select>

    {statusFilter && (
      <button
        onClick={() => {
          setStatusFilter("");
          setPage(1);
        }}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Clear
      </button>
    )}
  </div>

  {/* RIGHT: POST JOB */}
  <button
    onClick={() => navigate("/recruiter/jobs/create")}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 self-start md:self-auto"
  >
    + Post New Job
  </button>
</div>


      {/* TABLE */}
      <ResponsiveTable
        data={jobs}
        columns={columns}
        ordering={ordering}
        onSort={(key) => {
          setOrdering((prev) => {
            if (prev === key) return `-${key}`;
            if (prev === `-${key}`) return "";
            return key;
          });
          setPage(1);
        }}
        actions={actions}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {loading && <p className="text-sm text-gray-500">Loading jobs…</p>}

      {deleteJobId && (
        <ConfirmModal
          open
          loading={deleteLoading}
          title="Delete Job"
          description="Are you sure you want to delete this job? This action cannot be undone."
          onClose={() => !deleteLoading && setDeleteJobId(null)}
          onConfirm={handleDeleteJob}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
