import React from "react";

export default function EducationCard() {
  const educationList = [
    {
      degree: "MS/M.Sc(ScienceComputers)",
      institution: "Indian Institute of Information Technology and Management (IIITM-K), Kerala",
      duration: "2020-2022 | Full Time",
    },
    {
      degree: "B.Sc Computers",
      institution: "Calicut University",
      duration: "2017-2020 | Full Time",
    },
    {
      degree: "Class XII",
      institution: "Kerala",
      duration: "2017",
    },
  ];

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Education</h2>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Add education
        </button>
      </div>

      {/* Education Items */}
      <div className="space-y-6">
        {educationList.map((item, index) => (
          <div key={index} className="border-b last:border-none pb-6 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900">{item.degree}</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Edit
              </button>
            </div>

            <p className="text-sm text-gray-700">{item.institution}</p>

            <p className="text-sm text-gray-500 mt-1">{item.duration}</p>
          </div>
        ))}
      </div>

      {/* Additional Add Options */}
      <div className="mt-6 space-y-3">
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Add doctorate/PhD
        </button>
        <br />
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Add class X
        </button>
      </div>
    </div>
  );
}
