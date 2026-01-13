import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function RecruiterListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample recruiter data
  const recruiters = [
    { id: 1, name: "John Recruiter", company: "TechCorp", status: "approved" },
    { id: 2, name: "Sarah Hiring", company: "FinSolve", status: "pending" },
    { id: 3, name: "Mark Talent", company: "CloudNet", status: "rejected" },
    { id: 4, name: "Priya HR", company: "EduSmart", status: "approved" },
  ];

  const filteredRecruiters = recruiters.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(search.toLowerCase()) ||
      rec.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Recruiter Management</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search recruiter or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <Filter size={18} /> <span>Advanced filters coming soon...</span>
          </div>
        </div>
      </div>

      {/* Recruiters Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="p-3 font-medium text-gray-700">Name</th>
              <th className="p-3 font-medium text-gray-700">Company</th>
              <th className="p-3 font-medium text-gray-700">Status</th>
              <th className="p-3 font-medium text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecruiters.map((rec) => (
              <tr key={rec.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{rec.name}</td>
                <td className="p-3">{rec.company}</td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${rec.status === "approved" && "bg-green-100 text-green-700"}
                    ${rec.status === "pending" && "bg-yellow-100 text-yellow-700"}
                    ${rec.status === "rejected" && "bg-red-100 text-red-700"}
                  `}
                  >
                    {rec.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-3">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="text-green-600 hover:underline">Approve</button>
                  <button className="text-red-600 hover:underline">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
