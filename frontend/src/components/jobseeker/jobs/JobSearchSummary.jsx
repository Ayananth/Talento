import { TextInput, Select, Button } from "flowbite-react";
import { MapPin, Search } from "lucide-react";
export default function JobSearchSummary({
  jobCount = 22,
  search,
  setSearch,
  onSearch,
}) {
  return (
    <section className="bg-slate-50 rounded-3xl py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          <span className="text-blue-600">{jobCount} Jobs</span>{" "}
          Available Now
        </h2>

        <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
          Find jobs matching your skills and interests
        </p>

        <div className="mt-10 bg-white shadow-xl rounded-2xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

            {/* LOCATION (optional for later) */}
            <Select sizing="lg" icon={MapPin}
                          className="
                bg-white 
                text-slate-800 
                border-slate-300 
                focus:border-blue-600 
                focus:ring-blue-600
              ">
              <option value="">Location</option>
              <option value="remote">Remote</option>
              <option value="kochi">Kochi</option>
              <option value="bangalore">Bangalore</option>
            </Select>

            {/* KEYWORD */}
            <TextInput
              sizing="lg"
              icon={Search}
              placeholder="Job title, skills, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />

            {/* SEARCH BUTTON */}
            <Button size="lg" onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
