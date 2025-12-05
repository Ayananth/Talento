import React, { useEffect, useState } from "react";
import ExperienceModal from "./ExperienceModal";
import api from "../../apis/api";
import { Trash2 } from "lucide-react";


export default function EmploymentCard() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);

  // Load jobs
  useEffect(() => {
    api
      .get("/v1/profile/me/experience/")
      .then((res) => setJobs(res.data))
      .catch(() => setJobs([]));
  }, []);

  const handleSuccess = (updatedItem) => {
    if (editJob) {
      // Update existing job
      setJobs((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    } else {
      // Add new job
      setJobs((prev) => [...prev, updatedItem]);
    }
  };

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this experience?")) return;

  try {
    await api.delete(`/v1/profile/me/experience/${id}/`);
    setJobs((prev) => prev.filter((job) => job.id !== id));
  } catch (err) {
    console.log(err);
    alert("Failed to delete experience");
  }
};


  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">

      {/* Modal */}
      <ExperienceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditJob(null);
        }}
        onSuccess={handleSuccess}
        initialData={editJob}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Employment</h2>
        <button
          className="text-blue-600 text-sm font-medium hover:underline"
          onClick={() => setShowModal(true)}
        >
          Add employment
        </button>
      </div>

      {/* Employment List */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <div key={job.id} className="border-b last:border-none pb-6">
            <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900">{job.role}</h3>

            <div className="flex items-center gap-3">
                <button
                className="text-blue-600 text-sm hover:underline"
                onClick={() => {
                    setEditJob(job);
                    setShowModal(true);
                }}
                >
                Edit
                </button>

                <Trash2
                size={18}
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(job.id)}
                />
            </div>
            </div>


            <p className="text-gray-700 text-sm">{job.company}</p>

            <p className="text-gray-500 text-sm">
              {job.employment_type} | {job.start_date} to {job.end_date || "Present"}
            </p>

            {job.notice_period && (
              <p className="text-gray-500 text-sm">{job.notice_period}</p>
            )}

            {job.description && (
              <p className="text-gray-600 text-sm mt-1">{job.description}</p>
            )}

            {job.skills && (
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-medium">Skills:</span> {job.skills}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
