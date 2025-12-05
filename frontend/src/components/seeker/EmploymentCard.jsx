import React from "react";

export default function EmploymentCard() {
  const jobs = [
    {
      role: "Software Engineer",
      company: "Travancore Analytic",
      employmentType: "Full-time",
      duration: "Jul 2022 to Present (3 years 5 month)",
      notice: "15 Days or less Notice Period",
      roleDesc: "Python developer",
      skills: "Python, Django",
    },
    {
      role: "Software Engineer",
      company: "Travancore Analytic",
      employmentType: "Full-time",
      duration: "Jul 2022 to Jul 2022 (2 month)",
      roleDesc:
        "Experienced Software Engineer with 2 years of expertise in python backend development",
    },
  ];

  return (
    <div className=" bg-white border rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Employment</h2>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Add employment
        </button>
      </div>

      {/* Employment Items */}
      <div className="space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="border-b last:border-none pb-6 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900">{job.role}</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Edit
              </button>
            </div>

            <p className="text-gray-700 text-sm mb-1">{job.company}</p>

            {/* Employment details */}
            {job.duration && (
              <p className="text-gray-500 text-sm">
                {job.employmentType} | {job.duration}
              </p>
            )}
            {job.notice && (
              <p className="text-gray-500 text-sm">{job.notice}</p>
            )}

            {job.roleDesc && (
              <p className="text-gray-600 text-sm mt-1">{job.roleDesc}</p>
            )}

            {job.skills && (
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-medium">Top 5 key skills: </span>
                {job.skills}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
