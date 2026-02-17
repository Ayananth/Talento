import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "@/apis/recruiter/apis";
import { popularCitiesInIndia } from "@/utils/common/utils";
import "./jobform.css";

export default function CreateJobForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    responsibilities: "",
    requirements: "",
    education_requirement: "",
    job_type: "",
    work_mode: "",
    experience: "",
    experience_level: "",
    location_city: "",
    location_state: "",
    location_country: "India",
    salary_min: "",
    salary_max: "",
    salary_currency: "INR",
    salary_hidden: false,
    openings: 1,
    application_deadline: "",
    expires_at: "",
    skills: "",
  });

  /* -----------------------------
     HANDLE INPUT
  ----------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((p) => ({ ...p, [name]: null }));
    setFormError("");

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -----------------------------
     SUBMIT
  ----------------------------- */
  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    setFormError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        responsibilities: form.responsibilities || null,
        requirements: form.requirements || null,
        education_requirement: form.education_requirement || null,
        job_type: form.job_type,
        work_mode: form.work_mode,
        experience: form.experience ? Number(form.experience) : null,
        experience_level: form.experience_level,
        location_city: form.location_city || null,
        location_state: form.location_state || null,
        location_country: "India",
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        salary_currency: "INR",
        salary_hidden: form.salary_hidden,
        openings: Number(form.openings),
        application_deadline: form.application_deadline || null,
        expires_at: form.expires_at || null,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : [],
      };

      await createJob(payload);
      navigate("/recruiter/jobs");
    } catch (err) {
      const data = err?.response?.data;

      if (!data) {
        setFormError("Something went wrong. Please try again.");
      } else if (data.detail) {
        setFormError(data.detail);
      } else {
        const fieldErrors = {};
        Object.keys(data).forEach((key) => {
          fieldErrors[key] = Array.isArray(data[key])
            ? data[key][0]
            : data[key];
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     RENDER
  ----------------------------- */
  return (
    <div className="job-form-shell max-w-6xl">
      <div className="job-form-header">
        <p className="job-form-kicker">Recruiter Workspace</p>
        <h1 className="job-form-title">Post a New Job</h1>
        <p className="job-form-subtitle">
          Create a complete listing with role expectations, qualifications, and
          hiring details.
        </p>
      </div>

      {/* GLOBAL ERROR */}
      {formError && (
        <div className="form-error-box">
          {formError}
        </div>
      )}

      {/* BASIC INFO */}
      <section className="form-card">
        <h2 className="section-title">Basic Information</h2>

        <div className="space-y-5">
          <div>
            <label className="label">Job Title</label>
            <input
              name="title"
              className="input"
              placeholder="e.g. Senior Backend Engineer"
              onChange={handleChange}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              rows={6}
              className="input"
              placeholder="Describe the role, team, and business impact"
              onChange={handleChange}
            />
            {errors.description && (
              <p className="field-error">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="label">Responsibilities</label>
            <textarea
              name="responsibilities"
              rows={4}
              className="input"
              placeholder="List key day-to-day responsibilities"
              onChange={handleChange}
            />
            {errors.responsibilities && (
              <p className="field-error">{errors.responsibilities}</p>
            )}
          </div>

          <div>
            <label className="label">Requirements</label>
            <textarea
              name="requirements"
              rows={4}
              className="input"
              placeholder="Required qualifications, tools, and capabilities"
              onChange={handleChange}
            />
            {errors.requirements && (
              <p className="field-error">{errors.requirements}</p>
            )}
          </div>

          <div>
            <label className="label">Education Requirement</label>
            <textarea
              name="education_requirement"
              rows={3}
              className="input"
              placeholder="Degree, certifications, or equivalent requirement"
              onChange={handleChange}
            />
            {errors.education_requirement && (
              <p className="field-error">{errors.education_requirement}</p>
            )}
          </div>
        </div>
      </section>

      {/* JOB DETAILS */}
      <section className="form-card">
        <h2 className="section-title">Job Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="label">Job Type</label>
            <select name="job_type" className="input" onChange={handleChange}>
              <option value="">Job Type</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
            {errors.job_type && <p className="field-error">{errors.job_type}</p>}
          </div>

          <div>
            <label className="label">Work Mode</label>
            <select name="work_mode" className="input" onChange={handleChange}>
              <option value="">Work Mode</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
            {errors.work_mode && (
              <p className="field-error">{errors.work_mode}</p>
            )}
          </div>

          <div>
            <label className="label">Experience (Years)</label>
            <input
              type="number"
              min="0"
              step="1"
              name="experience"
              className="input"
              placeholder="e.g. 3"
              onChange={handleChange}
            />
            {errors.experience && <p className="field-error">{errors.experience}</p>}
          </div>

          <div>
            <label className="label">Experience Level</label>
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
            {errors.experience_level && (
              <p className="field-error">{errors.experience_level}</p>
            )}
          </div>

          <div>
            <label className="label">Openings</label>
            <input
              type="number"
              min="1"
              step="1"
              name="openings"
              className="input"
              placeholder="e.g. 2"
              onChange={handleChange}
            />
            {errors.openings && (
              <p className="field-error">{errors.openings}</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label">Application Deadline</label>
            <input
              type="date"
              name="application_deadline"
              className="input"
              onChange={handleChange}
            />
            {errors.application_deadline && (
              <p className="field-error">{errors.application_deadline}</p>
            )}
          </div>

          {/* <div>
            <label className="label">Expiry Date</label>
            <input
              type="datetime-local"
              name="expires_at"
              className="input"
              onChange={handleChange}
            />
            {errors.expires_at && (
              <p className="field-error">{errors.expires_at}</p>
            )}
          </div> */}
        </div>
      </section>

      {/* LOCATION */}
      <section className="form-card">
        <h2 className="section-title">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="label">City</label>
            <select
              name="location_city"
              className="input"
              onChange={handleChange}
            >
              <option value="">Select City</option>
              {popularCitiesInIndia.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.location_city && (
              <p className="field-error">{errors.location_city}</p>
            )}
          </div>

          <div>
            <label className="label">State</label>
            <input
              name="location_state"
              className="input"
              placeholder="State (optional)"
              onChange={handleChange}
            />
            {errors.location_state && (
              <p className="field-error">{errors.location_state}</p>
            )}
          </div>

          <div>
            <label className="label">Country</label>
            <input className="input" value="India" disabled />
          </div>
        </div>
      </section>

      {/* SALARY */}
      <section className="form-card">
        <h2 className="section-title">Salary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="label">Minimum Salary</label>
            <input
              type="number"
              name="salary_min"
              className="input"
              placeholder="Minimum"
              onChange={handleChange}
            />
            {errors.salary_min && (
              <p className="field-error">{errors.salary_min}</p>
            )}
          </div>

          <div>
            <label className="label">Maximum Salary</label>
            <input
              type="number"
              name="salary_max"
              className="input"
              placeholder="Maximum"
              onChange={handleChange}
            />
            {errors.salary_max && (
              <p className="field-error">{errors.salary_max}</p>
            )}
          </div>

          <div>
            <label className="label">Currency</label>
            <input className="input" value="INR" disabled />
          </div>
        </div>

        <label className="toggle-row">
          <input
            type="checkbox"
            name="salary_hidden"
            onChange={handleChange}
          />
          Hide salary from candidates
        </label>
      </section>

      {/* SKILLS */}
      <section className="form-card">
        <h2 className="section-title">Skills</h2>
        <label className="label">Required Skills</label>
        <input
          name="skills"
          className="input"
          placeholder="python, django, postgresql"
          onChange={handleChange}
        />
        {errors.skills && <p className="field-error">{errors.skills}</p>}
      </section>

      {/* ACTION */}
      <div className="action-row">
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
