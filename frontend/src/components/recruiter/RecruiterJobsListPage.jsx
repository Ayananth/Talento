import ResponsiveTable from "@/components/recruiter/ResponsiveTable";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const mockJobs = [
  {
    id: 1,
    title: "Senior Backend Engineer",
    status: "published",
    applications_count: 12,
    view_count: 340,
    expires_at: "2025-01-10",
    is_active: true,
    location_city: "Kochi",
    location_state: "Kerala",
    location_country: "India",
  },
  {
    id: 2,
    title: "React Developer",
    status: "draft",
    applications_count: 0,
    view_count: 22,
    expires_at: null,
    is_active: false,
    location_city: "Remote",
    location_country: "India",
  },
];


export default function RecruiterJobsListPage() {
  const [ordering, setOrdering] = useState("-created_at");
  const navigate = useNavigate()

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
      <button className="text-blue-600 text-sm hover:underline">
        View
      </button>

      {row.status === "draft" && (
        <button className="text-gray-700 text-sm hover:underline">
          Edit
        </button>
      )}

      {row.status === "published" && (
        <button className="text-red-600 text-sm hover:underline">
          Close
        </button>
      )}
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
      </div>

      {/* TABLE */}
      <ResponsiveTable
        data={mockJobs}
        columns={columns}
        ordering={ordering}
        onSort={(key) =>
          setOrdering((prev) =>
            prev === key ? `-${key}` : key
          )
        }
        actions={actions}
      />
    </div>
  );
}
