import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Bell,
  Briefcase,
  CheckCircle2,
  Clock3,
  Crown,
  Eye,
  PlusCircle,
  Users,
} from "lucide-react";

import { StatCard } from "@/components/recruiter/StatCard";
import UpgradeBanner from "../../components/jobseeker/UpgradeBanner";
import useAuth from "../../auth/context/useAuth";
import Toast from "@/components/common/Toast";
import {
  getRecruiterApplicationStats,
  getRecruiterJobs,
  getRecruiterNotifications,
  getRecruiterUnreadNotificationsCount,
} from "@/apis/recruiter/apis";



const formatExpiry = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { subscription } = useAuth();
  const isPro = subscription?.is_active;
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total_active: 0,
    under_review: 0,
    shortlisted: 0,
    interviewed: 0,
  });
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success" || paymentStatus === "sucess") {
      setToastMessage("You have unlocked Pro features.");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("payment");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [jobsRes, appStats, notificationsRes, unreadCount] = await Promise.all([
          getRecruiterJobs({ page: 1, ordering: "-created_at" }),
          getRecruiterApplicationStats(),
          getRecruiterNotifications({ page: 1, ordering: "-created_at" }),
          getRecruiterUnreadNotificationsCount(),
        ]);

        if (!isMounted) return;

        setJobs(jobsRes?.results || []);
        setStats(appStats || {});
        setNotifications(notificationsRes?.results || []);
        setUnreadNotificationCount(unreadCount || 0);
      } catch (error) {
        console.error("Failed to load recruiter dashboard", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalActiveJobs = useMemo(
    () => jobs.filter((job) => job.is_active && job.status !== "closed").length,
    [jobs]
  );

  const totalViews = useMemo(
    () => jobs.reduce((sum, job) => sum + (job.view_count || 0), 0),
    [jobs]
  );

  return (
    <div className="space-y-6">
      {isPro && (
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <Crown size={16} className="text-yellow-500" />
          <span className="font-medium text-slate-900">Pro membership</span>
          <span className="text-slate-500">
            · Valid till {formatExpiry(subscription?.end_date)}
          </span>
        </div>
      )}

      {!isPro && <UpgradeBanner role="recruiter" />}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Overview of your hiring activity and recent updates.
          </p>
        </div>
        <button
          onClick={() => navigate("/recruiter/jobs/create")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-fit"
        >
          <PlusCircle size={16} />
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Jobs" value={totalActiveJobs} Icon={Briefcase} />
        <StatCard label="Total Applications" value={stats.total_active || 0} Icon={Users} />
        <StatCard label="Profile Views" value={totalViews} Icon={Eye} />
        <StatCard label="Unread Notifications" value={unreadNotificationCount} Icon={Bell} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Application Pipeline</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Under Review</span>
              <span className="font-semibold text-gray-900">{stats.under_review || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Shortlisted</span>
              <span className="font-semibold text-gray-900">{stats.shortlisted || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Interviewed</span>
              <span className="font-semibold text-gray-900">{stats.interviewed || 0}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/recruiter/applications")}
            className="mt-4 w-full text-sm px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            View Applications
          </button>
        </div>

        <div className="bg-white border rounded-xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Recent Jobs</h2>
            <button
              onClick={() => navigate("/recruiter/jobs")}
              className="text-sm text-blue-600 hover:underline"
            >
              See all
            </button>
          </div>

          <div className="space-y-2">
            {jobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{job.title}</p>
                  <p className="text-xs text-gray-500">
                    Created {formatDate(job.created_at)} · Expires {formatDate(job.expires_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{job.applications_count || 0} applicants</p>
                  <p className="text-xs text-gray-500">{job.view_count || 0} views</p>
                </div>
              </div>
            ))}

            {!loading && jobs.length === 0 && (
              <div className="text-sm text-gray-500 py-2">
                No jobs posted yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Recent Notifications</h2>
          <button
            onClick={() => navigate("/recruiter/notifications")}
            className="text-sm text-blue-600 hover:underline"
          >
            Open Notifications
          </button>
        </div>

        <div className="space-y-2">
          {notifications.slice(0, 5).map((item) => (
            <div key={item.id} className="border rounded-lg p-3 flex items-start gap-3">
              <span
                className={`mt-1 w-2 h-2 rounded-full ${item.is_read ? "bg-gray-300" : "bg-blue-600"}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.title || "Notification"}</p>
                <p className="text-sm text-gray-600">{item.message || "No message"}</p>
                <p className="text-xs text-gray-500 mt-1 inline-flex items-center gap-1">
                  <Clock3 size={12} />
                  {formatDate(item.created_at)}
                  {!item.is_read && (
                    <span className="inline-flex items-center gap-1 ml-2 text-blue-600">
                      <CheckCircle2 size={12} />
                      Unread
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}

          {!loading && notifications.length === 0 && (
            <div className="text-sm text-gray-500 py-2">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
