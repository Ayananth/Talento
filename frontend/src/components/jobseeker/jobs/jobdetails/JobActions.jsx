import { useState } from "react";
import { Button } from "flowbite-react";
import { Bookmark } from "lucide-react";
import ApplyJobModal from "./ApplyJobModal";

export default function JobActions({
  jobId,
  isActive = true,
  status = "published",

  hasApplied = false,
  isSaved: initialSaved = false,
}) {
  const [openApply, setOpenApply] = useState(false);
  const [saved, setSaved] = useState(initialSaved);

  const canApply = isActive && status === "published" && !hasApplied;

  return (
    <>
      {/* ACTION BAR */}
      <div className="flex flex-wrap items-center gap-4 border border-slate-200 rounded-2xl p-6 bg-white">

        {/* APPLY */}
        <Button
          size="lg"
          disabled={!canApply}
          className={`${
            canApply
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={() => setOpenApply(true)}
        >
          {hasApplied ? "Applied" : "Apply now"}
        </Button>

        {/* SAVE */}
        <Button
          size="lg"
          color="light"
          onClick={() => setSaved(!saved)}
        >
          <Bookmark
            size={18}
            className={`mr-2 ${saved ? "fill-current" : ""}`}
          />
          {saved ? "Saved" : "Save job"}
        </Button>

        {/* STATUS MESSAGE */}
        {!isActive && (
          <p className="text-sm text-red-500">
            This job is no longer accepting applications
          </p>
        )}
      </div>

      {/* APPLY MODAL */}
      {canApply && (
        <ApplyJobModal
          jobId={jobId}
          open={openApply}
          onClose={() => setOpenApply(false)}
        />
      )}
    </>
  );
}
