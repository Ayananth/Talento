import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Button } from "flowbite-react";
import { Mail, Phone, MapPin, Calendar, Download, Eye, CheckCircle, XCircle, Clock, Briefcase, DollarSign, FileText, User, Tag, MessageSquare } from 'lucide-react';
import { getApplicantDetails, updateApplicationStatus } from '../../apis/recruiter/apis';
import { formatDateTime } from '../../utils/common/utils';
import { useNavigate } from "react-router-dom";
import { fetchConversation } from '../../apis/common/fetchConversation';
import api from '../../apis/api';



const STATUS_LABELS = {
  applied: "applied",
  under_review: "Under Review",
  shortlisted: "shortlisted",
  interview_scheduled: "interview",
  rejected: "rejected",
};

const STATUS_COLORS = {
  applied: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-green-100 text-green-800",
  interview_scheduled: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-800",
};


const displayValue = (value, fallback = "Not provided") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
};


export default function ApplicantDetailsPage() {
  const [status, setStatus] = useState('Applied');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [recruiterNotes, setRecruiterNotes] = useState('');




    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
  const { applicantId } = useParams();
  console.log("Applicant ID from URL:", applicantId);
  console.log(applicant)

const [toast, setToast] = useState(null);

const showToast = (message, type = "success") => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};

const navigate = useNavigate();


async function handleMessageCandidate(applicant) {
  try {
      // const res = await api.get("v1/chat/conversation/", {
      //   params: { job_id: applicant.job_id, other_user_id: applicant.applicant_id },
      // });

      const res = await fetchConversation(applicant.job_id, applicant.applicant_id);

      const conversation = res.data.conversation;
      console.log(conversation)

    if (conversation) {
      navigate("/recruiter/messages", {
        state: {
          openConversationId: conversation.id,
        },
      });
    } else {
      console.log(applicant.job_id, applicant.applicant_id, applicant.name);
      // return
      navigate("/recruiter/messages", {
        state: {
          draftChat: {
            id: null,
            jobId: applicant.job_id,
            otherUserId: applicant.applicant_id,
            name: applicant.name, // or full name later
            jobTitle: applicant.jobTitle,
          },
        },
      });
    }
  } catch (err) {
    console.error("Failed to open chat", err);
  }
}



useEffect(() => {
  const fetchApplicant = async () => {
    try {
      setLoading(true);
      const res = await getApplicantDetails(applicantId);
      setApplicant(res);
      console.log("Fetched applicant details:", res);
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


// useEffect(() => {
//   if (!applicant) return;

//   const updateStatus = async () => {
//     try {
//       await updateApplicationStatus(applicant.id, { status });
//       showToast(`Status changed to ${STATUS_LABELS[status]}`);
//     } catch (err) {
//       console.error("Failed to update application status", err);
//       showToast("Failed to update status", "error");
//     }
//   };

//   updateStatus();
// }, [status]);


function handleSaveNotes() {
  const saveNotes = async () => {
    try {
      if (applicant.recruiter_notes === recruiterNotes) {
        showToast("No changes to save");
        return;
      } 
      await updateApplicationStatus(applicant.id, { status: applicant.status, recruiter_notes: recruiterNotes });
      showToast("Recruiter notes saved successfully");
    } catch (err) {
      console.error("Failed to save recruiter notes", err);
      showToast("Failed to save notes", "error");
    }
  };

  saveNotes();
} 



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

const handleStatusChange = async (newStatus) => {
  if (!applicant) return;

  if (newStatus === "interview") {
    setShowInterviewModal(true);
    return;
  }

  if (newStatus === applicant.status) {
    return; // no-op
  }

  try {
    await updateApplicationStatus(applicant.id, { status: newStatus });
    setStatus(newStatus);
    setApplicant(prev => ({ ...prev, status: newStatus }));
    showToast(`Status changed to ${STATUS_LABELS[newStatus]}`);
  } catch (err) {
    console.error("Failed to update status", err);
    showToast("Failed to update status", "error");
  }
};



  const handleReject = (reason) => {
    setStatus('rejected');
    setShowRejectModal(false);
    // Here you would typically save the rejection reason
  };

  const handleScheduleInterview = (details) => {
    setStatus('interview scheduled');
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
<span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[status]}`}>
  {status}
</span>

              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="font-medium">{displayValue(applicant.jobTitle)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
  Applied: {new Date(applicant.applied_date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</span>

                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              {status!=='shortlisted' && (
              <button
                onClick={() => handleStatusChange('shortlisted')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Shortlist
              </button>
              )}
              {status === "shortlisted" && (
                <button
                  onClick={() => handleStatusChange("applied")}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Move to Under Review
                </button>
              )}

              {status!=="rejected" && (

              <button
                onClick={() => handleStatusChange('rejected')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              )}
              {/* <button
                onClick={() => handleStatusChange('interview')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </button> */}
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </h2>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleMessageCandidate(applicant)}
                  >
                    Message
                  </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                      {displayValue(applicant.email)}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${applicant.phone}`} className="text-blue-600 hover:underline">
                      {displayValue(applicant.phone)}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{displayValue(applicant.location)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900">{displayValue(applicant.experience)}</p>
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
                  <span className="font-medium text-gray-900">{displayValue(applicant.currentRole)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Notice Period</span>
                  <span className="font-medium text-gray-900">{displayValue(applicant.notice_period)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expected Salary</span>
                  <span className="font-medium text-gray-900">{displayValue(applicant.expected_salary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Salary</span>
                  <span className="font-medium text-gray-900">{displayValue(applicant.current_salary)}</span>
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
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recruiter Notes (Private)</h2>
              <textarea
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                placeholder="Add your private notes about this candidate..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
              onClick={handleSaveNotes}
              
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Notes
              </button>
            </div> */}
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recruiter Notes (Private)</h2>
              <textarea
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                placeholder="Add your private notes about this candidate..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
              onClick={handleSaveNotes}
              
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Notes
              </button>
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

{toast && (
  <div
    className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white
      ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}
    `}
  >
    {toast.message}
  </div>
)}

    </div>
  );
}