import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAdminJobDetails } from "@/apis/admin/jobs";
import { formatDateTime } from "@/utils/common/utils";

export default function AdminJobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------
     FETCH JOB
  --------------------------------------------------- */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await getAdminJobDetails(id);
        setJob(res);
      } catch (err) {
        console.error("Failed to load job", err);
        navigate("/admin/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading job details…
      </div>
    );
  }

  if (!job) return null;

  /* ---------------------------------------------------
     DERIVED VALUES
  --------------------------------------------------- */
  const location =
    job.location ||
    [job.location_city, job.location_state, job.location_country]
      .filter(Boolean)
      .join(", ");

  const salary =
    job.salary_min || job.salary_max
      ? `${job.salary_min ?? "—"} - ${job.salary_max ?? "—"} ${job.salary_currency || ""}`
      : "Not disclosed";

  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */
  return (
    <div className="p-4 md:p-6 max-w-7xl">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {job.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {job.company}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Published
          </span>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* META CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Job Type" value={job.job_type} />
            <InfoCard label="Work Mode" value={job.work_mode} />
            <InfoCard label="Experience Level" value={job.experience_level} />
            <InfoCard label="Salary" value={salary} />
            <InfoCard label="Location" value={location || "—"} />
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white border rounded-lg p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Job Description
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {job.description || "No description provided."}
            </p>
          </div>

          {/* SKILLS */}
          <div className="bg-white border rounded-lg p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Skills Required
            </h4>

            {job.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No skills listed
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">
              Recruiter Info
            </h4>

            <SidebarItem label="Email" value={job.email} />

            <hr />

            <SidebarItem
              label="Published At"
              value={job.published_at ? formatDateTime(job.published_at) : "—"}
            />
            <SidebarItem
              label="Expires At"
              value={job.expires_at ? formatDateTime(job.expires_at) : "—"}
            />
            {/* <SidebarItem
              label="Created At"
              value={job.created_at ? formatDateTime(job.created_at) : "—"}
            /> */}

            {/* ADMIN ACTIONS (future-ready) */}
            <div className="pt-4">
              <button className="w-full px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700">
                Unpublish Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   SMALL REUSABLE COMPONENTS
--------------------------------------------------- */

function InfoCard({ label, value }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">
        {value || "—"}
      </p>
    </div>
  );
}

function SidebarItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}
