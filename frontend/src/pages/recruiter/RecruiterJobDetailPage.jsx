import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecruiterJobDetail, updateJob } from "@/apis/recruiter/apis";

const emptyForm = {
  title: "",
  description: "",
  responsibilities: "",
  requirements: "",
  education_requirement: "",
  job_type: "",
  work_mode: "",
  experience_level: "",
  experience: "",
  location_city: "",
  location_state: "",
  salary_min: "",
  salary_max: "",
  salary_hidden: false,
  openings: 1,
  application_deadline: "",
  expires_at: "",
  skills: "",
};

export default function RecruiterJobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
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

  useEffect(() => {
    if (!job) return;

    setForm({
      title: job.title || "",
      description: job.description || "",
      responsibilities: job.responsibilities || "",
      requirements: job.requirements || "",
      education_requirement: job.education_requirement || "",
      job_type: job.job_type || "",
      work_mode: job.work_mode || "",
      experience_level: job.experience_level || "",
      experience: job.experience ?? "",
      location_city: job.location_city || "",
      location_state: job.location_state || "",
      salary_min: job.salary_min ?? "",
      salary_max: job.salary_max ?? "",
      salary_hidden: job.salary_hidden || false,
      openings: job.openings ?? 1,
      application_deadline: toLocalDateTimeInput(job.application_deadline),
      expires_at: toLocalDateTimeInput(job.expires_at),
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
    });
  }, [job]);

  const canEdit = useMemo(
    () => job?.is_active && job?.status !== "closed",
    [job]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSaveError("");
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError("");

      const payload = {
        title: form.title,
        description: form.description,
        responsibilities: form.responsibilities || null,
        requirements: form.requirements || null,
        education_requirement: form.education_requirement || null,
        job_type: form.job_type,
        work_mode: form.work_mode,
        experience_level: form.experience_level,
        experience: form.experience !== "" ? Number(form.experience) : null,
        location_city: form.location_city || null,
        location_state: form.location_state || null,
        location_country: job?.location_country || "India",
        salary_min: form.salary_min !== "" ? Number(form.salary_min) : null,
        salary_max: form.salary_max !== "" ? Number(form.salary_max) : null,
        salary_currency: job?.salary_currency || "INR",
        salary_hidden: form.salary_hidden,
        openings: Number(form.openings),
        application_deadline: toIsoFromLocalInput(form.application_deadline),
        expires_at: toIsoFromLocalInput(form.expires_at),
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      await updateJob(id, payload);
      const refreshed = await getRecruiterJobDetail(id);
      setJob(refreshed);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update job", err);
      const detail = err?.response?.data?.detail;
      setSaveError(detail || "Failed to update job. Please check your fields.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-500">Loading job...</div>;
  if (!job) return null;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
              Recruiter Job Overview
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-slate-900">
              {job.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={job.status} />
              <Pill>{job.view_count} views</Pill>
              <Pill>{toTitle(job.job_type)}</Pill>
              <Pill>{toTitle(job.work_mode)}</Pill>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!editing ? (
              <button
                onClick={() => {
                  if (!canEdit) return;
                  setSaveError("");
                  setEditing(true);
                }}
                disabled={!canEdit}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                  canEdit
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-slate-400 cursor-not-allowed"
                }`}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:bg-slate-400"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setSaveError("");
                    setForm({
                      title: job.title || "",
                      description: job.description || "",
                      responsibilities: job.responsibilities || "",
                      requirements: job.requirements || "",
                      education_requirement: job.education_requirement || "",
                      job_type: job.job_type || "",
                      work_mode: job.work_mode || "",
                      experience_level: job.experience_level || "",
                      experience: job.experience ?? "",
                      location_city: job.location_city || "",
                      location_state: job.location_state || "",
                      salary_min: job.salary_min ?? "",
                      salary_max: job.salary_max ?? "",
                      salary_hidden: job.salary_hidden || false,
                      openings: job.openings ?? 1,
                      application_deadline: toLocalDateTimeInput(
                        job.application_deadline
                      ),
                      expires_at: toLocalDateTimeInput(job.expires_at),
                      skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
                    });
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </>
            )}

            <button
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        </div>
      </section>

      {saveError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetaCard label="Published">{formatDate(job.published_at)}</MetaCard>
        <MetaCard label="Application Deadline">
          {formatDateTime(job.application_deadline)}
        </MetaCard>
        <MetaCard label="Expires">{formatDateTime(job.expires_at)}</MetaCard>
        <MetaCard label="Location">
          {[job.location_city, job.location_state, job.location_country]
            .filter(Boolean)
            .join(", ") || "Not specified"}
        </MetaCard>
      </div>

      {!editing ? (
        <>
          <Card title="Description">
            <p className="whitespace-pre-wrap text-slate-700 leading-7">
              {job.description || "No description provided."}
            </p>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card title="Responsibilities">
              <p className="whitespace-pre-wrap text-slate-700 leading-7">
                {job.responsibilities || "Not specified"}
              </p>
            </Card>
            <Card title="Requirements">
              <p className="whitespace-pre-wrap text-slate-700 leading-7">
                {job.requirements || "Not specified"}
              </p>
            </Card>
          </div>

          <Card title="Education Requirement">
            <p className="whitespace-pre-wrap text-slate-700 leading-7">
              {job.education_requirement || "Not specified"}
            </p>
          </Card>

          <Card title="Job Details">
            <DetailRow label="Job Type" value={toTitle(job.job_type)} />
            <DetailRow label="Work Mode" value={toTitle(job.work_mode)} />
            <DetailRow
              label="Experience Level"
              value={toTitle(job.experience_level)}
            />
            <DetailRow
              label="Experience (Years)"
              value={job.experience ?? "Not specified"}
            />
            <DetailRow label="Openings" value={job.openings ?? 1} />
            <DetailRow
              label="Salary"
              value={
                job.salary_hidden
                  ? "Hidden"
                  : `${job.salary_min ?? 0} - ${job.salary_max ?? 0} ${
                      job.salary_currency
                    }`
              }
            />
          </Card>

          <Card title="Skills">
            <div className="flex flex-wrap gap-2">
              {job.skills?.length ? (
                job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-600">No skills added.</span>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card title="Edit Job">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Job Title">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Openings">
              <input
                type="number"
                min="1"
                name="openings"
                value={form.openings}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Job Type">
              <select
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Select</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </Field>
            <Field label="Work Mode">
              <select
                name="work_mode"
                value={form.work_mode}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Select</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </Field>
            <Field label="Experience Level">
              <select
                name="experience_level"
                value={form.experience_level}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Select</option>
                <option value="fresher">Fresher</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </Field>
            <Field label="Experience (Years)">
              <input
                type="number"
                min="0"
                step="1"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="City">
              <input
                name="location_city"
                value={form.location_city}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="State">
              <input
                name="location_state"
                value={form.location_state}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Minimum Salary">
              <input
                type="number"
                min="0"
                name="salary_min"
                value={form.salary_min}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Maximum Salary">
              <input
                type="number"
                min="0"
                name="salary_max"
                value={form.salary_max}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Application Deadline">
              <input
                type="datetime-local"
                name="application_deadline"
                value={form.application_deadline}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            {/* <Field label="Expiry Date">
              <input
                type="datetime-local"
                name="expires_at"
                value={form.expires_at}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field> */}
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Description">
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Responsibilities">
              <textarea
                name="responsibilities"
                rows={4}
                value={form.responsibilities}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Requirements">
              <textarea
                name="requirements"
                rows={4}
                value={form.requirements}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Education Requirement">
              <textarea
                name="education_requirement"
                rows={3}
                value={form.education_requirement}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <Field label="Skills (comma separated)">
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="salary_hidden"
                checked={form.salary_hidden}
                onChange={handleChange}
              />
              Hide salary from candidates
            </label>
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function MetaCard({ label, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{children}</p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 last:border-none">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const colors = {
    published: "bg-emerald-100 text-emerald-700",
    closed: "bg-rose-100 text-rose-700",
    blocked: "bg-slate-200 text-slate-700",
    draft: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        colors[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {toTitle(status)}
    </span>
  );
}

function toTitle(value) {
  if (!value) return "Not specified";
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toLocalDateTimeInput(date) {
  if (!date) return "";
  const dt = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  const y = dt.getFullYear();
  const m = pad(dt.getMonth() + 1);
  const d = pad(dt.getDate());
  const h = pad(dt.getHours());
  const min = pad(dt.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

function toIsoFromLocalInput(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
