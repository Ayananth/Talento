import { Button } from "flowbite-react";
import { Briefcase, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../../apis/api";

const formatJobType = (value) =>
  value ? value.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) : "";

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export default function JobHeader({
  title,
  companyName,
  logo,
  jobType,
  workMode,
  publishedAt,
  hasApplied,
  onApply,
  job, recruiter,
  hasAppliedLocal
}) {

  const [error, setError] = useState(null);
  useEffect(() => {
    if (hasAppliedLocal && error) {
      setError(null);
    }
  }, [hasAppliedLocal, error]);

  const navigate = useNavigate();

  useEffect(() => {
  if (!error) return;

  const t = setTimeout(() => setError(null), 3000);
  return () => clearTimeout(t);
}, [error]);


const message = () => {
  if (!hasAppliedLocal) {
    setError("Please Apply first");
    return;
  }

  setError(null);

  navigate("/messages", {
    state: {
      draftChat: {
        id: null,
        jobId: job.id,
        otherUserId: job.recruiter_id,
        name: companyName,
        jobTitle: job.title,
      },
    },
  });
};

async function handleMessageRecruiter() {
    if (!hasApplied) {
      setError("Please Apply first");
      return;
    }
  const res = await api.get("v1/chat/conversation/", {
    params: { job_id: job.id },
  });

  const conversation = res.data.conversation;
  console.log(conversation)

  if (conversation) {
    navigate("/messages", {
      state: {
        openConversationId: conversation.id,
      },
    });
  } else {
    navigate("/messages", {
      state: {
        draftChat: {
          id: null,
          jobId: job.id,
          otherUserId: job.recruiter_id,
          name: companyName,
          jobTitle: job.title,
        },
      },
    });
  }
}




  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

        {/* LEFT */}
        <div className="flex gap-4">
          {/* LOGO */}
          {/* <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
            {logo ? (
              <img
                src={logo}
                alt={companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 text-sm">Logo</span>
            )}
          </div> */}

          {/* TEXT */}
          <div>
            {/* TITLE */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>

            {/* COMPANY */}
            <p className="mt-1 text-sm font-medium text-slate-600">
              {companyName}
            </p>

            {/* META */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Briefcase size={16} />
                {formatJobType(jobType)}
              </div>

              <div className="flex items-center gap-1 capitalize">
                <MapPin size={16} />
                {workMode}
              </div>

              <div className="flex items-center gap-1">
                <Clock size={16} />
                {timeAgo(publishedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}

<div className="flex flex-col items-start shrink-0 self-start">
  <Button
    size="lg"
    className="bg-blue-600 hover:bg-blue-700"
    onClick={handleMessageRecruiter}
  >
    Message
  </Button>

  <p className="mt-1 text-xs text-red-600 min-h-[1rem]">
    {error || ""}
    
  </p>
</div>





      </div>
    </div>
  );
}
