import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Mail, Phone, MapPin, Calendar, Download, Eye, CheckCircle, XCircle, Clock, Briefcase, DollarSign, FileText, User, Tag, MessageSquare } from 'lucide-react';
import { getApplicantDetails } from '../../apis/recruiter/apis';

export default function ApplicantDetailsPage() {
  const [status, setStatus] = useState('Applied');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [recruiterNotes, setRecruiterNotes] = useState('');


  // Sample applicant data
//   const applicant = {
//     id: 'APP-2024-0542',
//     name: 'Sarah Mitchell',
//     email: 'sarah.mitchell@email.com',
//     phone: '+1 (555) 123-4567',
//     location: 'San Francisco, CA',
//     jobTitle: 'Senior Frontend Developer',
//     appliedDate: 'Dec 28, 2024',
//     lastUpdated: 'Jan 3, 2025',
//     totalExperience: '6 years',
//     currentRole: 'Frontend Developer at TechCorp',
//     noticePeriod: '30 days',
//     expectedSalary: '$120,000 - $140,000',
//     currentSalary: '$110,000',
//     resumeUrl: '#',
//     resumeUploadDate: 'Dec 28, 2024',
//     applicationSource: 'Job Portal',
//     appliedVia: 'Website',
//     skills: [
//       { name: 'React', years: '5' },
//       { name: 'JavaScript', years: '6' },
//       { name: 'TypeScript', years: '4' },
//       { name: 'Next.js', years: '3' },
//       { name: 'Tailwind CSS', years: '3' },
//       { name: 'Node.js', years: '4' },
//       { name: 'Git', years: '6' },
//       { name: 'Redux', years: '4' }
//     ],
//     coverLetter: 'I am excited to apply for the Senior Frontend Developer position. With over 6 years of experience building scalable web applications, I have developed expertise in React, TypeScript, and modern frontend architectures. At TechCorp, I led the migration of our main product to a micro-frontend architecture, resulting in a 40% improvement in load times. I am particularly drawn to your company\'s focus on innovative user experiences and would love to contribute to your team.',
//     statusHistory: [
//       { status: 'Applied', date: 'Dec 28, 2024, 10:30 AM', by: 'System' },
//       { status: 'Under Review', date: 'Dec 30, 2024, 2:15 PM', by: 'John Recruiter' },
//       { status: 'Shortlisted', date: 'Jan 2, 2025, 11:00 AM', by: 'John Recruiter' }
//     ],
//     tags: ['Strong Candidate', 'Immediate Joiner', 'Referral']
//   };

    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
  const { applicantId } = useParams();
  console.log("Applicant ID from URL:", applicantId);


useEffect(() => {
  const fetchApplicant = async () => {
    try {
      setLoading(true);
      const res = await getApplicantDetails(applicantId);
      setApplicant(res);
      setStatus(res.status_display || res.status);
      setRecruiterNotes(res.recruiter_notes || "");
    } catch (err) {
      console.error("Failed to load applicant details", err);
    } finally {
      setLoading(false);
    }
  };

  if (applicantId) {
    fetchApplicant();
  }
}, [applicantId]);

if (loading || !applicant) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Loading applicant details...</p>
    </div>
  );
}



  const statusColors = {
    'Applied': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Shortlisted': 'bg-green-100 text-green-800',
    'Interview Scheduled': 'bg-purple-100 text-purple-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Offered': 'bg-emerald-100 text-emerald-800',
    'Hired': 'bg-teal-100 text-teal-800'
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'Rejected') {
      setShowRejectModal(true);
    } else if (newStatus === 'Interview Scheduled') {
      setShowInterviewModal(true);
    } else {
      setStatus(newStatus);
    }
  };

  const handleReject = (reason) => {
    setStatus('Rejected');
    setShowRejectModal(false);
    // Here you would typically save the rejection reason
  };

  const handleScheduleInterview = (details) => {
    setStatus('Interview Scheduled');
    setShowInterviewModal(false);
    // Here you would typically save interview details
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Always Visible */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{applicant.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                  {status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">{applicant.jobTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Applied: {applicant.applied_date}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('Shortlisted')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Shortlist
              </button>
              <button
                onClick={() => handleStatusChange('Rejected')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => handleStatusChange('Interview Scheduled')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
              <a
                href={applicant.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Resume
              </a>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                      {applicant.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${applicant.phone}`} className="text-blue-600 hover:underline">
                      {applicant.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">Location</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900">{applicant.experience}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Role</span>
                  <span className="font-medium text-gray-900">{applicant.currentRole||"current role"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Notice Period</span>
                  <span className="font-medium text-gray-900">{applicant.notice_period}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expected Salary</span>
                  <span className="font-medium text-gray-900">{applicant.expected_salary}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Salary</span>
                  <span className="font-medium text-gray-900">{applicant.current_salary}</span>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume
                </h2>
                <span className="text-sm text-gray-500">Uploaded: {applicant.resumeUploadDate||"resume date"}</span>
              </div>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Resume Preview</p>
                <div className="flex gap-3 justify-center">


              <a
                href={applicant.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                View / Download Resume
              </a>
                </div>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                  >
                    {skill} <span className="text-blue-500">•</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Cover Letter
              </h2>
              <p className="text-gray-700 leading-relaxed">{applicant.cover_letter}</p>
            </div>

            {/* Recruiter Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recruiter Notes (Private)</h2>
              <textarea
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                placeholder="Add your private notes about this candidate..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Notes
              </button>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Application Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Application ID</p>
                  <p className="font-medium text-gray-900">{applicant.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Job ID</p>
                  <p className="font-medium text-gray-900">{applicant.job_id}</p>
                </div>
                {/* <div>
                  <p className="text-gray-500">Applied Via</p>
                  <p className="font-medium text-gray-900">{applicant.appliedVia}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">{applicant.lastUpdated}</p>
                </div> */}
              </div>
            </div>

            {/* Status Timeline */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h2>
              <div className="space-y-4">
                {applicant.statusHistory.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${index === applicant.statusHistory.length - 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      {index !== applicant.statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900">{item.status}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                      <p className="text-xs text-gray-400">by {item.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Tags */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {applicant.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div> */}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Profile Views</span>
                  <span className="font-bold text-xl">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Days Active</span>
                  <span className="font-bold text-xl">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Response Time</span>
                  <span className="font-bold text-xl">2h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reject Candidate</h3>
            <textarea
              placeholder="Reason for rejection (optional)"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject('')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Schedule Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule Interview</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interview Mode</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Video Call</option>
                  <option>Phone Call</option>
                  <option>In-Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleScheduleInterview({})}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Schedule & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}