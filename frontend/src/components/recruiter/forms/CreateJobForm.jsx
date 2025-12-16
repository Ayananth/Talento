import { useState } from "react";
import "./jobform.css"

export default function CreateJobForm() {
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
    salary_hidden: false,
    openings: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div className="max-w-5xl bg-white rounded-2xl shadow-sm p-10">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-slate-900 mb-10">
        Post a New Job
      </h1>

      {/* BASIC INFO */}
      <section className="mb-12">
        <h2 className="section-title">Basic Information</h2>

        <div className="space-y-6">
          <div>
            <label className="label">Job Title</label>
            <input
              name="title"
              className="input"
              placeholder="e.g. Senior Backend Engineer"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Job Description</label>
            <textarea
              name="description"
              rows={6}
              className="input"
              placeholder="Describe the role, responsibilities, and expectations"
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* JOB DETAILS */}
      <section className="mb-12">
        <h2 className="section-title">Job Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Job Type</label>
            <select name="job_type" className="input" onChange={handleChange}>
              <option value="">Select</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="label">Work Mode</label>
            <select name="work_mode" className="input" onChange={handleChange}>
              <option value="">Select</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>

          <div>
            <label className="label">Experience Level</label>
            <select
              name="experience_level"
              className="input"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="fresher">Fresher</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="mb-12">
        <h2 className="section-title">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">City</label>
            <input
              name="location_city"
              className="input"
              placeholder="City"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">State</label>
            <input
              name="location_state"
              className="input"
              placeholder="State"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Country</label>
            <input
              name="location_country"
              className="input"
              value="India"
              disabled
            />
          </div>
        </div>
      </section>

      {/* SALARY */}
      <section className="mb-12">
        <h2 className="section-title">Salary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Minimum</label>
            <input
              type="number"
              name="salary_min"
              className="input"
              placeholder="Min salary"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Maximum</label>
            <input
              type="number"
              name="salary_max"
              className="input"
              placeholder="Max salary"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Currency</label>
            <input className="input" value="INR" disabled />
          </div>
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

      {/* HIRING */}
      <section className="mb-12">
        <h2 className="section-title">Hiring</h2>

        <div className="w-40">
          <label className="label">Openings</label>
          <input
            type="number"
            name="openings"
            min={1}
            className="input"
            onChange={handleChange}
          />
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button className="btn-secondary">Save as Draft</button>
        <button className="btn-primary">Publish Job</button>
      </div>
    </div>
  );
}
