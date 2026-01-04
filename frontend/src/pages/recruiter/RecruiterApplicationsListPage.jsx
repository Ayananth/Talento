import React, { useState, useEffect } from 'react';
import { User, Briefcase, Calendar, Mail, Phone, MapPin, Download, Eye, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';
import {getRecruiterApplications} from '../../apis/recruiter/apis';

const RecruiterApplicationsListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [candidates, setCandidates] = useState([]);


  useEffect(() => {
    // Fetch applications data from API when component mounts
    const fetchApplications = async () => {
      try {
        const data = await getRecruiterApplications();
        setCandidates(data.results); 
        console.log(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);
  

  // Sample data for applied candidates
//   const candidates = [
//     {
//       id: 1,
//       name: 'Sarah Johnson',
//       email: 'sarah.johnson@email.com',
//       phone: '+1 (555) 123-4567',
//       position: 'Senior Frontend Developer',
//       location: 'San Francisco, CA',
//       experience: '5 years',
//       appliedDate: '2024-01-02',
//       status: 'Under Review',
//       skills: ['React', 'TypeScript', 'Node.js'],
//       resumeUrl: '#'
//     },
//     {
//       id: 2,
//       name: 'Michael Chen',
//       email: 'michael.chen@email.com',
//       phone: '+1 (555) 234-5678',
//       position: 'React Developer',
//       location: 'Remote',
//       experience: '3 years',
//       appliedDate: '2024-01-01',
//       status: 'Interview Scheduled',
//       skills: ['React', 'JavaScript', 'CSS'],
//       resumeUrl: '#'
//     },
//     {
//       id: 3,
//       name: 'Emily Rodriguez',
//       email: 'emily.rodriguez@email.com',
//       phone: '+1 (555) 345-6789',
//       position: 'UI/UX Developer',
//       location: 'New York, NY',
//       experience: '4 years',
//       appliedDate: '2023-12-30',
//       status: 'Shortlisted',
//       skills: ['Figma', 'React', 'CSS'],
//       resumeUrl: '#'
//     },
//     {
//       id: 4,
//       name: 'David Park',
//       email: 'david.park@email.com',
//       phone: '+1 (555) 456-7890',
//       position: 'Full Stack Engineer',
//       location: 'Austin, TX',
//       experience: '6 years',
//       appliedDate: '2023-12-28',
//       status: 'Rejected',
//       skills: ['React', 'Node.js', 'MongoDB'],
//       resumeUrl: '#'
//     },
//     {
//       id: 5,
//       name: 'Amanda White',
//       email: 'amanda.white@email.com',
//       phone: '+1 (555) 567-8901',
//       position: 'Senior Frontend Developer',
//       location: 'Seattle, WA',
//       experience: '7 years',
//       appliedDate: '2024-01-03',
//       status: 'Offer Extended',
//       skills: ['React', 'Vue', 'TypeScript'],
//       resumeUrl: '#'
//     },
//     {
//       id: 6,
//       name: 'James Wilson',
//       email: 'james.wilson@email.com',
//       phone: '+1 (555) 678-9012',
//       position: 'React Developer',
//       location: 'Remote',
//       experience: '2 years',
//       appliedDate: '2023-12-25',
//       status: 'Under Review',
//       skills: ['React', 'JavaScript', 'Tailwind'],
//       resumeUrl: '#'
//     }
//   ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Shortlisted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Offer Extended':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const positions = ['all', ...new Set(candidates.map(c => c.position))];
  const statusOptions = ['all', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Rejected'];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    const matchesPosition = positionFilter === 'all' || candidate.position === positionFilter;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const stats = {
    total: candidates.length,
    underReview: candidates.filter(c => c.status === 'Under Review').length,
    shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
    interviewed: candidates.filter(c => c.status === 'Interview Scheduled').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applied Candidates</h1>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interviewed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewed}</p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
              >
                {positions.map(position => (
                  <option key={position} value={position}>
                    {position === 'all' ? 'All Positions' : position}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Status' : option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position Applied
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {candidate.applicant_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.applicant_name}</div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {candidate.applicant_email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {candidate.phone}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {candidate.skills.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                        {candidate.job_title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {candidate.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{candidate.experience_years}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(candidate.appliedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Resume"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Shortlist"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredCandidates.length}</span> of{' '}
            <span className="font-medium">{candidates.length}</span> candidates
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterApplicationsListPage;