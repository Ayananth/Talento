import { Button } from "flowbite-react";
import { Briefcase, Clock } from "lucide-react";

export default function JobHeader({
  title = "Senior Full Stack Engineer, Creator Success Full Time",
  jobType = "Fulltime",
  postedAgo = "3 mins ago",
  onApply = () => {},
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        {/* LEFT */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            {title}
          </h1>

          {/* META */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Briefcase size={16} />
              {jobType}
            </div>

            <div className="flex items-center gap-1">
              <Clock size={16} />
              {postedAgo}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 shrink-0"
          onClick={onApply}
        >
          Apply now
        </Button>
      </div>
    </div>
  );
}
