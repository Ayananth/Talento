import { Select, Button } from "flowbite-react";
import { LayoutGrid, List } from "lucide-react";

export default function JobResultsToolbar({
  from = 41,
  to = 60,
  total = 944,
  view = "grid",
  onViewChange = () => {},
  onReset = () => {},
}) {
  return (
    <div className=" max-w-6xl mx-auto text-center border-b border-slate-200 pb-4 mb-6 mt-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Advance Filter
          </h3>

          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:underline"
          >
            Reset
          </button>
        </div>

        {/* CENTER */}
        <div className="text-sm text-slate-500">
          Showing {from}–{to} of {total} jobs
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* SHOW COUNT */}
          <Select
            sizing="sm"
            className="bg-white text-slate-700 border-slate-300"
          >
            <option>Show: 12</option>
            <option>Show: 24</option>
            <option>Show: 48</option>
          </Select>

          {/* SORT */}
          <Select
            sizing="sm"
            className="bg-white text-slate-700 border-slate-300"
          >
            <option>Sort by: Newest Post</option>
            <option>Oldest Post</option>
            <option>Highest Salary</option>
            <option>Lowest Salary</option>
          </Select>

          {/* VIEW TOGGLE */}
          {/* <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewChange("list")}
              className={`p-2 ${
                view === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <List size={16} />
            </button>

            <button
              onClick={() => onViewChange("grid")}
              className={`p-2 ${
                view === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
          </div> */}

        </div>
      </div>
    </div>
  );
}
