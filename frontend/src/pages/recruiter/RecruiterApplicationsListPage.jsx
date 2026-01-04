import React, { useState, useEffect } from "react";
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
} from "../../apis/recruiter/apis";

import { StatCard } from "../../components/recruiter/StatCard";
import { CandidateRow } from "../../components/recruiter/CandidateRow";

/* -------------------------
   STATUS HELPERS
------------------------- */

const STATUS_LABELS = {
  applied: "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview Scheduled",
  offered: "Offer Extended",
  rejected: "Rejected",
};



/* -------------------------
   MAIN COMPONENT
------------------------- */

const RecruiterApplicationsListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

  const [candidates, setCandidates] = useState([]);
  const [applicationStats, setApplicationStats] = useState({
    total_active: 0,
    under_review: 0,
    shortlisted: 0,
    interviewed: 0,
  });

  /* -------------------------
     FETCH DATA
  ------------------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applications, stats] = await Promise.all([
          getRecruiterApplications(),
          getRecruiterApplicationStats(),
        ]);

        setCandidates(applications.results || []);
        setApplicationStats(stats);
      } catch (error) {
        console.error("Error loading recruiter dashboard:", error);
      }
    };

    fetchData();
  }, []);

  /* -------------------------
     FILTERS
  ------------------------- */

  const positions = [
    "all",
    ...new Set(candidates.map((c) => c.job_title)),
  ];

  const statusOptions = [
    "all",
    "applied",
    "shortlisted",
    "interview",
    "offered",
    "rejected",
  ];

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.applicant_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.applicant_email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;

    const matchesPosition =
      positionFilter === "all" ||
      candidate.job_title === positionFilter;

    return matchesSearch && matchesStatus && matchesPosition;
  });

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
          <StatCard
            label="Total Applications"
            value={applicationStats.total_active}
            Icon={User}
          />
          <StatCard
            label="Under Review"
            value={applicationStats.under_review}
            Icon={Clock}
          />
          <StatCard
            label="Shortlisted"
            value={applicationStats.shortlisted}
            Icon={CheckCircle}
          />
          <StatCard
            label="Interviewed"
            value={applicationStats.interviewed}
            Icon={Briefcase}
          />
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBox value={searchTerm} onChange={setSearchTerm} />

            <SelectFilter
              value={positionFilter}
              onChange={setPositionFilter}
              options={positions}
              label="All Positions"
            />

            <SelectFilter
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              label="All Status"
            />
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
                  <th key={h} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredCandidates.map((c) => (
                <CandidateRow key={c.id} candidate={c} />
              ))}
            </tbody>
          </table>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No candidates found
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   SUB COMPONENTS
------------------------- */


const SearchBox = ({ value, onChange }) => (
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      placeholder="Search by name, email, or skills..."
      className="w-full pl-10 pr-4 py-2 border rounded-lg"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const SelectFilter = ({ value, onChange, options, label }) => (
  <select
    className="pl-4 pr-8 py-2 border rounded-lg bg-white"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o === "all" ? label : STATUS_LABELS[o] || o}
      </option>
    ))}
  </select>
);



export default RecruiterApplicationsListPage;
