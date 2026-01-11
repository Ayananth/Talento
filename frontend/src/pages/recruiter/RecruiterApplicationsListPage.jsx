import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";

import {
  getRecruiterApplications,
  getRecruiterApplicationStats,
  getRecruiterJobs
} from "../../apis/recruiter/apis";

import { StatCard } from "../../components/recruiter/StatCard";
import { CandidateRow } from "../../components/recruiter/CandidateRow";
import Pagination from "@/components/common/Pagination";
import { PAGE_SIZE } from "../../constants/constants";

/* -------------------------
   STATUS LABELS
------------------------- */

const STATUS_LABELS = {
  applied: "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview Scheduled",
  // offered: "Offer Extended",
  rejected: "Rejected",
  hired: "Hired"
};

/* -------------------------
   MAIN COMPONENT
------------------------- */

const RecruiterApplicationsListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const [applicationStats, setApplicationStats] = useState({
    total_active: 0,
    under_review: 0,
    shortlisted: 0,
    interviewed: 0,
  });

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  const navigate = useNavigate();

  /* -------------------------
     FETCH DATA
  ------------------------- */

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const [applications, stats] = await Promise.all([
        getRecruiterApplications({
          page,
          search: searchTerm,
          status: statusFilter,
          job: positionFilter,
        }),
        getRecruiterApplicationStats(),
      ]);

      setCandidates(applications.results || []);
      setCount(applications.count || 0);
      setApplicationStats(stats);
    } catch (error) {
      console.error("Error loading recruiter applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        const res = await getRecruiterJobs();
        setJobs(res.results || []);
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);


  useEffect(() => {
    fetchApplications();
  }, [page, searchTerm, statusFilter, positionFilter]);

  /* -------------------------
     FILTER OPTIONS
  ------------------------- */

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "applied", label: "Under Review" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "interview", label: "Interview" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" },
  ];

  /* -------------------------
     RENDER
  ------------------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Applied Candidates
          </h1>
          <p className="text-gray-600">
            Review and manage job applications
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Applications" value={applicationStats.total_active} Icon={User} />
          <StatCard label="Under Review" value={applicationStats.under_review} Icon={Clock} />
          <StatCard label="Shortlisted" value={applicationStats.shortlisted} Icon={CheckCircle} />
          <StatCard label="Interviewed" value={applicationStats.interviewed} Icon={Briefcase} />
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">

            {/* POSITION FILTER */}
            <select
              className={`pl-4 pr-8 py-2 border rounded-lg bg-white ${
                jobsLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              value={positionFilter}
              disabled={jobsLoading}
              onChange={(e) => {
                setPositionFilter(e.target.value);
                setPage(1);
              }}
            >
              {jobsLoading ? (
                <option>Loading positions…</option>
              ) : (
                <>
                  <option value="">All Positions</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </>
              )}
            </select>

            {/* STATUS FILTER */}
            <select
              className="pl-4 pr-8 py-2 border rounded-lg bg-white"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

          </div>
        </div>


        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Candidate",
                  "Position",
                  "Location",
                  "Experience",
                  "Applied Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {candidates.map((c) => (
                <CandidateRow key={c.id} candidate={c}  />
              ))}
            </tbody>
          </table>

          {!loading && candidates.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No candidates found
              </h3>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {loading && (
          <p className="text-sm text-gray-500 mt-2">
            Loading applications…
          </p>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplicationsListPage;
