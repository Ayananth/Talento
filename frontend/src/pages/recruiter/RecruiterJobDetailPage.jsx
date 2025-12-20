import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecruiterJobDetail } from "@/apis/recruiter/apis";

export default function RecruiterJobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getRecruiterJobDetail(id);
        setJob(res);
      } catch (err) {
        console.error("Failed to load job", err);
        navigate("/recruiter/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading job…</div>;
  }

  if (!job) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {job.title}
          </h1>

          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={job.status} />
            <span className="text-sm text-gray-500">
              {job.view_count} views
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/recruiter/jobs/${id}/edit`)}
            disabled={!job.is_active || job.status === "closed"}
            className={`px-4 py-2 rounded text-white text-sm
              ${
                job.is_active && job.status !== "closed"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Edit
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded border text-sm"
          >
            Back
          </button>
        </div>
      </div>

      {/* META CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetaCard label="Published">
          {formatDate(job.published_at)}
        </MetaCard>
        <MetaCard label="Expires">
          {formatDate(job.expires_at)}
        </MetaCard>
        <MetaCard label="Location">
          {[job.location_city, job.location_state, job.location_country]
            .filter(Boolean)
            .join(", ")}
        </MetaCard>
      </div>

      {/* DESCRIPTION */}
      <Card title="Job Description">
        <p className="text-gray-700 leading-relaxed">
          {job.description}
        </p>
      </Card>

      {/* DETAILS */}
      <Card title="Job Details">
        <DetailRow label="Job Type" value={job.job_type} />
        <DetailRow label="Work Mode" value={job.work_mode} />
        <DetailRow label="Experience" value={job.experience_level} />
        <DetailRow
          label="Salary"
          value={
            job.salary_hidden
              ? "Hidden"
              : `${job.salary_min} - ${job.salary_max} ${job.salary_currency}`
          }
        />
      </Card>

      {/* SKILLS */}
      <Card title="Skills Required">
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

const Card = ({ title, children }) => (
  <div className="bg-white border rounded-xl shadow-sm p-6">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const MetaCard = ({ label, children }) => (
  <div className="bg-white border rounded-lg p-4">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-900 mt-1">{children}</p>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b last:border-none">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900 capitalize">
      {value}
    </span>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    published: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
    blocked: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
