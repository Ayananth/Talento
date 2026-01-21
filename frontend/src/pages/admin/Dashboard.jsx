import React, { useState, useEffect } from 'react';
import { Users, Briefcase, DollarSign, FileText, TrendingUp, Bell, CheckCircle, XCircle, AlertTriangle, Send } from 'lucide-react';
import api from "../../apis/api"

const Dashboard = () => {
  const [activeMetric, setActiveMetric] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/v1/admin/dashboard/overview");
        setMetricsData(res.data.metrics);
      } catch (error) {
        console.error("Failed to load dashboard metrics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



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

  const quickActions = [
    { id: 1, label: 'Approve Pending Jobs', icon: CheckCircle, variant: 'primary', count: 7 },
    { id: 2, label: 'Block Recruiter', icon: XCircle, variant: 'danger', count: 3 },
    { id: 3, label: 'View Reported Jobs', icon: AlertTriangle, variant: 'warning', count: 12 },
    { id: 4, label: 'Send Notification', icon: Send, variant: 'secondary', count: null },
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

  const getButtonStyles = (variant) => {
    const styles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
      warning: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
    };
    return styles[variant] || styles.secondary;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your job portal performance and activities</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 animate-pulse h-28"
              />
            ))
          ) : (
            metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.id}
                  onMouseEnter={() => setActiveMetric(metric.id)}
                  onMouseLeave={() => setActiveMetric(null)}
                  className={`bg-white rounded-lg p-5 shadow-sm border border-gray-200 transition-all duration-200 cursor-pointer ${
                    activeMetric === metric.id
                      ? 'shadow-md border-blue-300 transform -translate-y-0.5'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-500">{metric.label}</div>
                </div>
              );
            })
          )}
        </div>


        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-sm transition-colors ${getButtonStyles(
                      action.variant
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </div>
                    {action.count && (
                      <span className="px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-xs font-semibold">
                        {action.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Additional Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Server Status</span>
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">API Response</span>
                  <span className="text-gray-900 font-medium">24ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uptime</span>
                  <span className="text-gray-900 font-medium">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;