import React, { useState, useEffect } from 'react';
import { Users, Briefcase, DollarSign, FileText, TrendingUp, Bell, CheckCircle, XCircle, AlertTriangle, Send, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from "../../apis/api"

const Dashboard = () => {
  const [activeMetric, setActiveMetric] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [topRecruiters, setTopRecruiters] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState(null);

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
    setTopRecruiters(res.data.recruiters || []);
    setTopCandidates(res.data.jobseekers || []);
    setRevenueData(res.data.revenue || []);
    setRevenueSummary(res.data.revenue_summary);
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





  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      yellow: 'text-yellow-600 bg-yellow-50',
      gray: 'text-gray-600 bg-gray-50',
    };
    return colors[color] || colors.gray;
  };
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{payload[0].payload.month}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-xs text-gray-600">Recruiter</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${payload.find(p => p.dataKey === 'recruiter')?.value.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Job Seeker</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${payload.find(p => p.dataKey === 'jobseeker')?.value.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Total</span>
                <span className="text-sm font-bold text-gray-900">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
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
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Year {revenueSummary?.year} Performance</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{metricsData?.revenue_year}</p>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm text-gray-600">Recruiter Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Job Seeker Revenue</span>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="recruiter" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="jobseeker" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Recruiter Revenue</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Total {revenueSummary?.year}</p>
                <p className="text-xs text-blue-600">₹{revenueSummary?.recruiter_revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Job Seeker Revenue</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Total {revenueSummary?.year}</p>
                <p className="text-xs text-green-600">₹{revenueSummary?.jobseeker_revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Growth Rate</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Year-over-Year</p>
                <p className="text-xs">{revenueSummary?.growth_rate || "No previous data"}</p>
              </div>
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
                {topRecruiters.length === 0 ? (
                  <p className="text-sm text-gray-500">No recruiter data available</p>
                ) : (
                  topRecruiters.map((recruiter, index) => (
                    <div
                      key={recruiter.recruiter_id}
                      className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {/* Logo */}
                        {recruiter.logo ? (
                          <img
                            src={recruiter.logo}
                            alt={recruiter.company_name}
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold text-sm">
                            {recruiter.company_name?.[0] || "?"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {recruiter.company_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {recruiter.job_count} jobs · {recruiter.location}
                          </p>
                        </div>
                      </div>

                      <div className="text-xl font-bold text-gray-400">#{index + 1}</div>
                    </div>
                  ))
                )}
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
                {topCandidates.length === 0 ? (
                  <p className="text-sm text-gray-500">No candidate data available</p>
                ) : (
                  topCandidates.map((candidate, index) => (
                    <div
                      key={candidate.applicant_id}
                      className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {candidate.profile_image ? (
                          <img
                            src={candidate.profile_image}
                            alt={candidate.fullname}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                            {candidate.fullname?.[0] || "?"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {candidate.fullname}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {candidate.headline}
                          </p>
                        </div>
                      </div>

                      <div className="text-xl font-bold text-gray-400">#{index + 1}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;