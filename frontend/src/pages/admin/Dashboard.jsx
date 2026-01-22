import React, { useState, useEffect } from 'react';
import { Users, Briefcase, DollarSign, FileText, TrendingUp, Bell, CheckCircle, XCircle, AlertTriangle, Send, RefreshCw } from 'lucide-react';
import api from "../../apis/api"

const Dashboard = () => {
  const [activeMetric, setActiveMetric] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);



  useEffect(() => {
    fetchDashboardData();

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30_000);
    return () => clearInterval(intervalId);
  }, []);


const fetchDashboardData = async (isManual = false) => {
  try {
    if (isManual) setRefreshing(true);

    const res = await api.get("/v1/admin/dashboard/overview");
    setMetricsData(res.data.metrics);
    setLastUpdated(new Date());
  } catch (error) {
    console.error("Failed to load dashboard metrics", error);
  } finally {
    if (isManual) setRefreshing(false);
    setLoading(false);
  }
};






  const metrics = metricsData
    ? [
        {
          id: 1,
          label: 'Yearly Revenue',
          value: metricsData.revenue_year.toLocaleString(),
          icon: DollarSign,
        },
        {
          id: 2,
          label: 'Monthly Revenue',
          value: metricsData.revenue__month.toLocaleString(),
          icon: DollarSign,
        },
        {
          id: 3,
          label: 'Jobseekers',
          value: metricsData.total_jobseekers,
          icon: Users,
        },
        {
          id: 4,
          label: 'Recruiters',
          value: metricsData.total_recruiters,
          icon: Users,
        },
        {
          id: 5,
          label: 'Active Jobs',
          value: metricsData.active_jobs,
          icon: Briefcase,
        },
      ]
    : [];


  const activities = [
    { id: 1, type: 'job', icon: Briefcase, text: 'New job posted by TechCorp Solutions', time: '5 mins ago', color: 'blue' },
    { id: 2, type: 'candidate', icon: Users, text: 'Sarah Johnson applied for Senior Developer', time: '12 mins ago', color: 'green' },
    { id: 3, type: 'alert', icon: AlertTriangle, text: 'Job listing flagged for review', time: '23 mins ago', color: 'yellow' },
    { id: 4, type: 'recruiter', icon: CheckCircle, text: 'New recruiter verified: InnovateCo', time: '1 hour ago', color: 'green' },
    { id: 5, type: 'application', icon: FileText, text: '45 new applications received', time: '2 hours ago', color: 'blue' },
    { id: 6, type: 'payment', icon: DollarSign, text: 'Payment received from Acme Corp', time: '3 hours ago', color: 'green' },
    { id: 7, type: 'job', icon: Briefcase, text: 'Job posting expired: Marketing Manager', time: '4 hours ago', color: 'gray' },
    { id: 8, type: 'candidate', icon: Users, text: 'Michael Chen completed profile', time: '5 hours ago', color: 'blue' },
  ];

  const topRecruiters = [
    { id: 1, company: 'TechCorp Solutions', logo: 'TC', jobs: 24, color: 'bg-blue-500' },
    { id: 2, company: 'InnovateCo', logo: 'IC', jobs: 18, color: 'bg-purple-500' },
    { id: 3, company: 'Digital Dynamics', logo: 'DD', jobs: 15, color: 'bg-green-500' },
    { id: 4, company: 'Future Systems', logo: 'FS', jobs: 12, color: 'bg-orange-500' },
    { id: 5, company: 'Acme Corporation', logo: 'AC', jobs: 10, color: 'bg-red-500' },
  ];

  const topCandidates = [
    { id: 1, name: 'Sarah Johnson', avatar: 'SJ', headline: 'Senior Full Stack Developer', color: 'bg-blue-500' },
    { id: 2, name: 'Michael Chen', avatar: 'MC', headline: 'UI/UX Design Lead', color: 'bg-purple-500' },
    { id: 3, name: 'Emily Rodriguez', avatar: 'ER', headline: 'Data Science Manager', color: 'bg-green-500' },
    { id: 4, name: 'James Wilson', avatar: 'JW', headline: 'DevOps Engineer', color: 'bg-orange-500' },
    { id: 5, name: 'Lisa Anderson', avatar: 'LA', headline: 'Product Manager', color: 'bg-pink-500' },
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      yellow: 'text-yellow-600 bg-yellow-50',
      gray: 'text-gray-600 bg-gray-50',
    };
    return colors[color] || colors.gray;
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
<div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-semibold text-gray-900">
      Dashboard Overview
    </h1>
    <p className="text-xs text-gray-400 mt-1">
      Last updated: {lastUpdated?.toLocaleTimeString() || "—"}
    </p>
  </div>

  <button
    onClick={() => fetchDashboardData(true)}
    disabled={refreshing}
    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
  >
    <RefreshCw
      className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
    />
    Refresh
  </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                onMouseEnter={() => setActiveMetric(metric.id)}
                onMouseLeave={() => setActiveMetric(null)}
                className={`bg-white rounded-lg p-5 shadow-sm border border-gray-200 transition-all duration-200 cursor-pointer ${
                  activeMetric === metric.id ? 'shadow-md border-blue-300 transform -translate-y-0.5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {metric.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Recent Activity Feed */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className={`p-2 rounded-lg ${getIconColor(activity.color)} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Top Recruiters and Candidates */}
          <div className="space-y-6">
            {/* Top Recruiters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900">Top Recruiters</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {topRecruiters.map((recruiter, index) => (
                  <div
                    key={recruiter.id}
                    className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${recruiter.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                        {recruiter.logo}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{recruiter.company}</p>
                        <p className="text-xs text-gray-500">{recruiter.jobs} jobs posted</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-400">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Candidates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900">Top Candidates</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {topCandidates.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${candidate.color} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                        {candidate.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{candidate.name}</p>
                        <p className="text-xs text-gray-500 truncate">{candidate.headline}</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-400">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;