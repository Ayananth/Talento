import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, MapPin, Clock, Filter } from 'lucide-react';
import { getMyApplications } from '../../apis/jobseeker/apis';
import Pagination from "../../components/common/Pagination"


const STATUS_CONFIG = {
  all: {
    label: "All Status",
    value: "",
  },
  applied: {
    label: "Applied",
    color: "bg-blue-100 text-blue-800",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-green-100 text-green-800",
  },
  interview: {
    label: "Interview",
    color: "bg-purple-100 text-purple-800",
  },
  offered: {
    label: "Offered",
    color: "bg-green-100 text-green-800",
  },
  hired: {
    label: "Hired",
    color: "bg-emerald-100 text-emerald-800",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "bg-gray-200 text-gray-800",
  },
};

const ORDERING_OPTIONS = [
  {
    label: "Newest first",
    value: "-applied_at",
  },
  {
    label: "Oldest first",
    value: "applied_at",
  },
  {
    label: "Recently updated",
    value: "-updated_at",
  },
  {
    label: "Status (A → Z)",
    value: "status",
  },
];




const AppliedJobsDashboard = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordering, setOrdering] = useState("-applied_at");

useEffect(() => {
  setPage(1);
}, [statusFilter, ordering]);


useEffect(() => {
  const fetchAppliedJobs = async () => {
    try {
      const data = await getMyApplications({
        page,
        status: statusFilter === "all" ? "" : statusFilter,
        ordering,

      });

      setAppliedJobs(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // match backend page size
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  fetchAppliedJobs();
}, [page, statusFilter, ordering]);



  
  // const filteredJobs = appliedJobs.filter(job => {
  //   const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });

  // const statusOptions = ['all', 'Under Review', 'Interview Scheduled', 'Offer Received', 'Rejected'];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Applied Jobs</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by position or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              /> */}
            </div>

<div className="relative w-full md:w-auto">
  <select
    className="w-full md:w-auto pl-4 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    value={ordering}
    onChange={(e) => setOrdering(e.target.value)}
  >
    {ORDERING_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>

            <div className="relative w-full md:w-auto">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full md:w-auto pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>

            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:hidden divide-y divide-gray-200">
            {appliedJobs.map((job) => (
              <article key={job.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{job.company_name}</p>
                    {job.type && (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {job.type}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      STATUS_CONFIG[job.status]?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {STATUS_CONFIG[job.status]?.label || job.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.location_city || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{job.salary || "Salary not disclosed"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Applied {new Date(job.applied_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appliedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.company_name}</div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {job.location_city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        {/* <DollarSign className="w-4 h-4 text-gray-400 mr-1" /> */}
                        {job.salary}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(job.applied_at).toLocaleDateString()}
                      </div>
                    </td>
<td className="px-6 py-4">
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      STATUS_CONFIG[job.status]?.color || "bg-gray-100 text-gray-800"
    }`}
  >
    {STATUS_CONFIG[job.status]?.label || job.status}
  </span>
</td>

                    {/* <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {appliedJobs.length === 0 && (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {totalPages >= 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(num) => setPage(num)}
            />
          </div>
        )}


        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {appliedJobs.length} applications

          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedJobsDashboard;
