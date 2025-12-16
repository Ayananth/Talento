import { useState } from "react";
import { Button } from "flowbite-react";
import { Bookmark } from "lucide-react";
import ApplyJobModal from "./ApplyJobModal";

export default function JobActions() {
  const [openApply, setOpenApply] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <>
      {/* ACTION BAR */}
      <div className="flex flex-wrap items-center gap-4 border border-slate-200 rounded-2xl p-6 bg-white">
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setOpenApply(true)}
        >
          Apply now
        </Button>

        <Button
          size="lg"
          color="light"
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={18} className="mr-2" />
          {saved ? "Saved" : "Save job"}
        </Button>

        {/* (Optional) Share section later */}
      </div>

      {/* APPLY MODAL */}
      <ApplyJobModal
        open={openApply}
        onClose={() => setOpenApply(false)}
      />
    </>
  );
}
