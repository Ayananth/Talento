import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "@/apis/recruiter/apis";
import "./jobform.css";

export default function CreateJobForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    job_type: "",
    work_mode: "",
    experience_level: "",
    location_city: "",
    location_state: "",
    location_country: "India",
    salary_min: "",
    salary_max: "",
    salary_currency: "INR",
    salary_hidden: false,
    openings: 1,
    expires_at: "",
    skills: "",
  });

  /* -----------------------------
     HANDLE INPUT
  ----------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -----------------------------
     SUBMIT
  ----------------------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        title: form.title,
        description: form.description,
        job_type: form.job_type,
        work_mode: form.work_mode,
        experience_level: form.experience_level,
        location_city: form.location_city || null,
        location_state: form.location_state || null,
        location_country: "India",
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        salary_currency: "INR",
        salary_hidden: form.salary_hidden,
        openings: Number(form.openings),
        expires_at: form.expires_at || null,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : [],
      };

      await createJob(payload);
      navigate("/recruiter/jobs");
    } catch (err) {
      console.error(err);
      setError("Failed to create job. Please check the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl bg-white rounded-2xl shadow-sm p-10">
      <h1 className="text-2xl font-semibold text-slate-900 mb-10">
        Post a New Job
      </h1>

      {error && (
        <p className="mb-6 text-sm text-red-600">{error}</p>
      )}

      {/* BASIC INFO */}
      <section className="mb-12">
        <h2 className="section-title">Basic Information</h2>

        <div className="space-y-6">
          <input
            name="title"
            className="input"
            placeholder="Job title"
            onChange={handleChange}
          />

          <textarea
            name="description"
            rows={6}
            className="input"
            placeholder="Describe the role and responsibilities"
            onChange={handleChange}
          />
        </div>
      </section>

      {/* JOB DETAILS */}
      <section className="mb-12">
        <h2 className="section-title">Job Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select name="job_type" className="input" onChange={handleChange}>
            <option value="">Job Type</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>

          <select name="work_mode" className="input" onChange={handleChange}>
            <option value="">Work Mode</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>

          <select
            name="experience_level"
            className="input"
            onChange={handleChange}
          >
            <option value="">Experience Level</option>
            <option value="fresher">Fresher</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </section>

      {/* LOCATION */}
      <section className="mb-12">
        <h2 className="section-title">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            name="location_city"
            className="input"
            placeholder="City"
            onChange={handleChange}
          />
          <input
            name="location_state"
            className="input"
            placeholder="State"
            onChange={handleChange}
          />
          <input className="input" value="India" disabled />
        </div>
      </section>

      {/* SALARY */}
      <section className="mb-12">
        <h2 className="section-title">Salary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="number"
            name="salary_min"
            className="input"
            placeholder="Minimum"
            onChange={handleChange}
          />
          <input
            type="number"
            name="salary_max"
            className="input"
            placeholder="Maximum"
            onChange={handleChange}
          />
          <input className="input" value="INR" disabled />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            name="salary_hidden"
            onChange={handleChange}
          />
          Hide salary from candidates
        </label>
      </section>

      {/* SKILLS */}
      <section className="mb-12">
        <h2 className="section-title">Skills</h2>
        <input
          name="skills"
          className="input"
          placeholder="python, django, postgresql"
          onChange={handleChange}
        />
      </section>

      {/* EXPIRY */}
      {/* <section className="mb-12">
        <h2 className="section-title">Expiry</h2>
        <input
          type="datetime-local"
          name="expires_at"
          className="input"
          onChange={handleChange}
        />
      </section> */}

      {/* ACTION */}
      <div className="flex gap-4">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="btn-primary"
        >
          {loading ? "Posting…" : "Create Job"}
        </button>
      </div>
    </div>
  );
}
