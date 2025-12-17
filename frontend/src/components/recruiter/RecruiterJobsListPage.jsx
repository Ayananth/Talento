import ResponsiveTable from "@/components/recruiter/ResponsiveTable";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecruiterJobs, deleteJob } from "@/apis/recruiter/apis";
import ConfirmModal from "../common/ConfirmModal";
import Toast from "@/components/common/Toast";






export default function RecruiterJobsListPage() {
const [jobs, setJobs] = useState([]);
const [ordering, setOrdering] = useState("-created_at");
const [loading, setLoading] = useState(true);
const [deleteJobId, setDeleteJobId] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);
const [toast, setToast] = useState(null);



  const navigate = useNavigate()

const fetchJobs = async () => {
  try {
    setLoading(true);

    const res = await getRecruiterJobs(1, ordering);

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
  } catch (err) {
    console.error("Failed to load recruiter jobs", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchJobs();
}, [ordering]);

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
      type: "Failed",
      message: "Failed to delete",
    });
  } finally {
    setDeleteLoading(false);
  }
};



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
      render: (row) => (
        <span className="font-medium">{row.applications_count}</span>
      ),
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
      render: (row) => (
        <span>
          {[row.location_city, row.location_state, row.location_country]
            .filter(Boolean)
            .join(", ")}
        </span>
      ),
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

const actions = (row) => (
  <div className="flex gap-2">
    <button
      onClick={() => navigate(`/recruiter/jobs/${row.id}`)}
      className="text-blue-600 text-sm hover:underline"
    >
      View
    </button>

    <button
      onClick={() => navigate(`/recruiter/jobs/${row.id}/edit`)}
      className="text-gray-700 text-sm hover:underline"
    >
      Edit
    </button>

<button
  onClick={() => setDeleteJobId(row.id)}
  className="text-red-600 text-sm hover:underline"
>
  Close
</button>

  </div>
);


  return (
    <div className="p-6 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          My Jobs
        </h1>

        <button 
        onClick={()=>navigate('/recruiter/jobs/create')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Post New Job
        </button>
{/* <button
  disabled={!canPostJobs}
  className={`px-4 py-2 rounded-lg text-white
    ${canPostJobs
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-gray-400 cursor-not-allowed"}
  `}
>
  + Post New Job
</button> */}

      </div>

      {/* TABLE */}
      <ResponsiveTable
        data={jobs}
        columns={columns}
        ordering={ordering}
        onSort={(key) =>
          setOrdering((prev) =>
            prev === key ? `-${key}` : key
          )
        }
        actions={actions}
      />
{loading && (
  <p className="text-sm text-gray-500">
    Loading jobs…
  </p>


)}

{deleteJobId && (
  <ConfirmModal
    open={true}
    loading={deleteLoading}
    title="Delete Job"
    description="Are you sure you want to delete this job? This action cannot be undone."
    onClose={() => {
      if (!deleteLoading) setDeleteJobId(null);
    }}
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
