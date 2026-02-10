import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAdminJobDetails, unpublishAdminJob } from "@/apis/admin/jobs";
import { formatDateTime } from "@/utils/common/utils";

export default function AdminJobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unpublishing, setUnpublishing] = useState(false);
  const [actionError, setActionError] = useState("");

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
    job.salary_hidden
      ? "Hidden"
      : job.salary_min || job.salary_max
      ? `${job.salary_min ?? "—"} - ${job.salary_max ?? "—"} ${job.salary_currency || ""}`
      : "Not disclosed";

  const canUnpublish = job.status === "published";

  const handleUnpublish = async () => {
    if (!canUnpublish || unpublishing) return;

    setActionError("");
    setUnpublishing(true);
    try {
      const res = await unpublishAdminJob(id);
      setJob((prev) => ({
        ...prev,
        status: res.status ?? prev.status,
      }));
    } catch (err) {
      console.error("Failed to unpublish job", err);
      setActionError(
        err?.response?.data?.detail ||
          "Failed to unpublish job. Please try again."
      );
    } finally {
      setUnpublishing(false);
    }
  };

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
          {job.status &&
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {job.status ?.toUpperCase()}
          </span>
}

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
            <InfoCard label="Job Type" value={toTitle(job.job_type)} />
            <InfoCard label="Work Mode" value={toTitle(job.work_mode)} />
            <InfoCard
              label="Experience Level"
              value={toTitle(job.experience_level)}
            />
            <InfoCard
              label="Experience (Years)"
              value={job.experience ?? "—"}
            />
            <InfoCard label="Openings" value={job.openings ?? "—"} />
            <InfoCard label="Salary" value={salary} />
            <InfoCard label="Location" value={location || "—"} />
            <InfoCard label="Views" value={job.view_count ?? "—"} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Responsibilities
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {job.responsibilities || "Not specified."}
              </p>
            </div>

            <div className="bg-white border rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Requirements
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {job.requirements || "Not specified."}
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Education Requirement
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {job.education_requirement || "Not specified."}
            </p>
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
              label="Application Deadline"
              value={
                job.application_deadline
                  ? formatDateTime(job.application_deadline)
                  : "—"
              }
            />
            <SidebarItem
              label="Published At"
              value={job.published_at ? formatDateTime(job.published_at) : "—"}
            />
            <SidebarItem
              label="Expires At"
              value={job.expires_at ? formatDateTime(job.expires_at) : "—"}
            />
            <SidebarItem
              label="Created At"
              value={job.created_at ? formatDateTime(job.created_at) : "—"}
            />
            <SidebarItem
              label="Updated At"
              value={job.updated_at ? formatDateTime(job.updated_at) : "—"}
            />
            <SidebarItem
              label="Active"
              value={job.is_active ? "Yes" : "No"}
            />

            {/* ADMIN ACTIONS (future-ready) */}
            <div className="pt-4">
              <button
                onClick={handleUnpublish}
                disabled={!canUnpublish || unpublishing}
                className={`w-full px-4 py-2 text-sm rounded-md text-white ${
                  canUnpublish && !unpublishing
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {unpublishing
                  ? "Unpublishing..."
                  : canUnpublish
                    ? "Unpublish Job"
                    : "Job Already Unpublished"}
              </button>
              {actionError && (
                <p className="mt-2 text-xs text-red-600">{actionError}</p>
              )}
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

function toTitle(value) {
  if (!value) return "—";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}
