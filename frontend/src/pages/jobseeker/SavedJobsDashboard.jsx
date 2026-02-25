import React, { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Eye,
  Clock,
} from "lucide-react";
import { getSavedJobs } from "../../apis/jobseeker/apis";
import Pagination from "../../components/common/Pagination";
import { useNavigate } from "react-router-dom";

const ORDERING_OPTIONS = [
  { label: "Newest first", value: "-created_at" },
  { label: "Oldest first", value: "created_at" },
];

const SavedJobsDashboard = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordering, setOrdering] = useState("-created_at");

  const navigate = useNavigate();

useEffect(() => {
  const fetchSavedJobs = async () => {
    try {
      const data = await getSavedJobs({
        page,
        ordering,
      });

      setSavedJobs(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  fetchSavedJobs();
}, [page, ordering]);

  const renderSalary = (job) => {
    if (!job.salary_min && !job.salary_max) {
      return <span className="text-gray-500">Not disclosed</span>;
    }

    return (
      <span className="flex items-center text-sm text-gray-900">
        <IndianRupee className="w-4 h-4 text-gray-400 mr-1" />
        {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}{" "}
        {job.salary_currency}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Saved Jobs
          </h1>
          <p className="text-gray-600">
            Jobs you’ve bookmarked to apply later
          </p>
        </div>

        {/* Sorting */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex justify-end">
          <select
            className="w-full sm:w-auto pl-4 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:hidden divide-y divide-gray-200">
            {savedJobs.map((item) => {
              const job = item.job;

              return (
                <article key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex-shrink-0">
                        {job.logo ? (
                          <img
                            src={job.logo}
                            alt={job.company_name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{job.company_name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{job.location_city}, {job.location_country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-gray-400" />
                      <span>
                        {job.salary_min || job.salary_max
                          ? `${job.salary_min ? job.salary_min.toLocaleString() : "N/A"} - ${job.salary_max ? job.salary_max.toLocaleString() : "N/A"} ${job.salary_currency || ""}`
                          : "Not disclosed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Saved {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Company & Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Saved On
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {savedJobs.map((item) => {
                  const job = item.job;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {/* Company & Role */}
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {job.logo ? (
                              <img
                                src={job.logo}
                                alt={job.company_name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                          </div>

                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {job.company_name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {job.location_city}, {job.location_country}
                        </div>
                      </td>

                      {/* Salary */}
                      <td className="px-6 py-4">
                        {renderSalary(job)}
                      </td>

                      {/* Saved date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Job
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {savedJobs.length === 0 && (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No saved jobs
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Save jobs to view them later.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(num) => setPage(num)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsDashboard;
