import React from 'react'

const JobFilters = ({ filters, setFilters, salaryDraft, setSalaryDraft, onApplySalary, onResetSalary }) => {



  const toggleArrayValue = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };


const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
];




  return (


          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
              <div className="space-y-6">

                {/* LOCATION */}
                {/* <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Location
                  </h4>
                  <input
                    type="text"
                    placeholder="City or country"
                    className="w-full rounded-lg border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div> */}

                {/* WORK MODE */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Work mode
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    {WORK_MODES.map(({ value, label }) => (
                      <label key={value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={filters.workMode.includes(value)}
                          onChange={() => toggleArrayValue("workMode", value)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* JOB TYPE */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Job type
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    {JOB_TYPES.map(({ value, label }) => (
                      <label key={value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.jobType.includes(value)}
                          onChange={() => toggleArrayValue("jobType", value)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* EXPERIENCE LEVEL */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Experience level
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    {EXPERIENCE_LEVELS.map(({ value, label }) => (
                      <label key={value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.experience.includes(value)}
                          onChange={() => toggleArrayValue("experience", value)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* DATE POSTED */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Date posted
                  </h4>
                  <select 
              value={filters.postedWithin}
              onChange={(e) =>
                setFilters((p) => ({ ...p, postedWithin: e.target.value }))
              }
                  
                  className="w-full rounded-lg border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Any time</option>
                    <option value="1">Last 24 hours</option>
                    <option value="3">Last 3 days</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                  </select>
                </div>

              {/* SALARY RANGE */}
{/* SALARY RANGE */}
<div>
  <h4 className="text-sm font-semibold text-slate-900 mb-2">
    Salary range (₹)
  </h4>

  <p className="text-xs text-slate-500 mb-3">
    Apply salary separately
  </p>

  <div className="flex gap-3 mb-3">
    <input
      type="number"
      placeholder="Min"
      value={salaryDraft.min}
      onChange={(e) =>
        setSalaryDraft((p) => ({ ...p, min: e.target.value }))
      }
      className="w-1/2 rounded-lg border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
    />

    <input
      type="number"
      placeholder="Max"
      value={salaryDraft.max}
      onChange={(e) =>
        setSalaryDraft((p) => ({ ...p, max: e.target.value }))
      }
      className="w-1/2 rounded-lg border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
    />
  </div>

  <div className="flex gap-2">
    <button
      onClick={onApplySalary}
      disabled={
        salaryDraft.min === filters.salaryMin &&
        salaryDraft.max === filters.salaryMax
      }
      className="flex-1 rounded-lg bg-blue-600 text-white text-sm py-2
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Apply salary
    </button>

    <button
      onClick={onResetSalary}
      className="flex-1 rounded-lg border border-slate-300
                 text-slate-700 text-sm py-2 hover:bg-slate-50"
    >
      Reset
    </button>
  </div>
</div>



                {/* ACTIONS */}
                {/* <div className="pt-4 border-t border-slate-200 flex gap-3">
                  <button
                    className="w-full rounded-lg bg-blue-600 text-white text-sm py-2 hover:bg-blue-700"
                  >
                    Apply filters
                  </button>
                  <button
                    className="w-full rounded-lg border border-slate-300 text-slate-700 text-sm py-2 hover:bg-slate-50"
                  >
                    Reset
                  </button>
                </div> */}

              </div>
            </div>
          </aside>



      

  )
}

export default JobFilters
