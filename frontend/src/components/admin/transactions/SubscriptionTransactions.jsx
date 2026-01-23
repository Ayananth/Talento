import React, { useEffect, useState } from 'react';
import { Search, Download, Filter, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getTransactions } from '../../../apis/admin/getTransactions';

const SubscriptionTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [transactions1, setTransactions1] = []



  const fetchTransaction = async ()=>{
    const res = await getTransactions();
    return res
  }

  useEffect(()=>{
  })

  // Sample transaction data
  const transactions = [
    {
      id: 'TXN-001234',
      user: 'John Doe',
      email: 'john.doe@email.com',
      plan: 'Premium',
      amount: 99.00,
      status: 'completed',
      date: '2026-01-20',
      paymentMethod: 'Credit Card',
      duration: '1 Month'
    },
    {
      id: 'TXN-001235',
      user: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      plan: 'Basic',
      amount: 29.00,
      status: 'completed',
      date: '2026-01-20',
      paymentMethod: 'PayPal',
      duration: '1 Month'
    },
    {
      id: 'TXN-001236',
      user: 'Mike Johnson',
      email: 'mike.j@email.com',
      plan: 'Enterprise',
      amount: 299.00,
      status: 'pending',
      date: '2026-01-19',
      paymentMethod: 'Bank Transfer',
      duration: '3 Months'
    },
    {
      id: 'TXN-001237',
      user: 'Emily Brown',
      email: 'emily.b@email.com',
      plan: 'Premium',
      amount: 99.00,
      status: 'failed',
      date: '2026-01-19',
      paymentMethod: 'Credit Card',
      duration: '1 Month'
    },
    {
      id: 'TXN-001238',
      user: 'David Wilson',
      email: 'david.w@email.com',
      plan: 'Basic',
      amount: 29.00,
      status: 'completed',
      date: '2026-01-18',
      paymentMethod: 'Credit Card',
      duration: '1 Month'
    },
    {
      id: 'TXN-001239',
      user: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      plan: 'Premium',
      amount: 279.00,
      status: 'completed',
      date: '2026-01-18',
      paymentMethod: 'PayPal',
      duration: '3 Months'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPlanBadge = (plan) => {
    const styles = {
      Basic: 'bg-blue-100 text-blue-800',
      Premium: 'bg-purple-100 text-purple-800',
      Enterprise: 'bg-indigo-100 text-indigo-800'
    };
    return styles[plan] || 'bg-gray-100 text-gray-800';
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesPlan = planFilter === 'all' || txn.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    revenue: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Transactions</h1>
          <p className="text-gray-600">Manage and track all subscription payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by user, email, or transaction ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <option value="all">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{txn.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{txn.user}</div>
                      <div className="text-sm text-gray-500">{txn.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanBadge(txn.plan)}`}>
                        {txn.plan}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{txn.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">${txn.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(txn.status)}
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(txn.status)}`}>
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(txn.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.paymentMethod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredTransactions.length}</span> of{' '}
            <span className="font-medium">{transactions.length}</span> transactions
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTransactions;