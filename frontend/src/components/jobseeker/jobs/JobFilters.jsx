import React from 'react'

const JobFilters = ({ filters, setFilters }) => {

  const toggleArrayValue = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  console.log("Filters: ",filters)



  return (


          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
              <div className="space-y-6">

                {/* LOCATION */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Location
                  </h4>
                  <input
                    type="text"
                    placeholder="City or country"
                    className="w-full rounded-lg border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* WORK MODE */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Work mode
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    {["remote", "hybrid", "onsite"].map((mode) => (
                      <label key={mode} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={filters.workMode.includes(mode)}
                            onChange={() => toggleArrayValue("workMode", mode)}
                        />
                        {mode.replace("_", " ")}
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
                    {[
                      "Full-time",
                      "Part-time",
                      "Contract",
                      "Internship",
                      "Freelance",
                    ].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {type}
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
                    {["Fresher", "Junior", "Mid", "Senior", "Lead"].map((level) => (
                      <label key={level} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>

                {/* DATE POSTED */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Date posted
                  </h4>
                  <select className="w-full rounded-lg border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Any time</option>
                    <option value="1">Last 24 hours</option>
                    <option value="3">Last 3 days</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                  </select>
                </div>

                {/* SALARY RANGE */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Salary range (₹)
                  </h4>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 rounded-lg border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 rounded-lg border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="pt-4 border-t border-slate-200 flex gap-3">
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
                </div>

              </div>
            </div>
          </aside>



      

  )
}

export default JobFilters
