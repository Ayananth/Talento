import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { Bookmark } from "lucide-react";
import ApplyJobModal from "./ApplyJobModal";

export default function JobActions({
  jobId,
  isActive = true,
  status = "published",
  hasApplied,
  isSaved: initialSaved = false,
  hasAppliedLocal,
  setHasAppliedLocal,
}) {
  const [openApply, setOpenApply] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  // const [hasAppliedLocal, setHasAppliedLocal] = useState(hasApplied);

  useEffect(() => {
    setHasAppliedLocal(hasApplied);
  }, [hasAppliedLocal]);

  const canApply =
    isActive && status === "published" && !hasAppliedLocal;

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 border border-slate-200 rounded-2xl p-6 bg-white">

        {/* APPLY */}
        <Button
          size="lg"
          color={hasAppliedLocal ? "light" : "blue"}
          disabled={!canApply}
          onClick={() => setOpenApply(true)}
        >
          {hasAppliedLocal ? "Applied" : "Apply now"}
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

        {!isActive && (
          <p className="text-sm text-red-500">
            This job is no longer accepting applications
          </p>
        )}
      </div>

      {/* APPLY MODAL */}
      <ApplyJobModal
        jobId={jobId}
        open={openApply}
        onClose={() => setOpenApply(false)}
        onApplied={() => setHasAppliedLocal(true)}
      />
    </>
  );
}
