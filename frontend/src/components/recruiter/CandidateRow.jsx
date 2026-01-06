import {
  User,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CandidateRow = ({ candidate }) => {
  const navigate = useNavigate();
  
  return (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4">
      <div className="font-medium">{candidate.applicant_name}</div>
      <div className="text-sm text-gray-500">{candidate.applicant_email}</div>
    </td>
    <td className="px-6 py-4">{candidate.job_title}</td>
    <td className="px-6 py-4">{candidate.location}</td>
    <td className="px-6 py-4">{candidate.experience_years} yrs</td>
    <td className="px-6 py-4">
      {new Date(candidate.applied_at).toLocaleDateString()}
    </td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(candidate.status)}`}>
        {STATUS_LABELS[candidate.status]}
      </span>
    </td>
    <td className="px-6 py-4 flex gap-2">
      <a href={candidate.resume_url} target="_blank" rel="noreferrer">
        <Download className="w-4 h-4 text-blue-600" />
      </a>
      <Eye onClick={()=> navigate("/recruiter/applications/" + candidate.id)} className="w-4 h-4 text-gray-600" />
      <CheckCircle className="w-4 h-4 text-green-600" />
      <XCircle className="w-4 h-4 text-red-600" />
    </td>
  </tr>
)};

/* -------------------------
   STATUS HELPERS
------------------------- */

const STATUS_LABELS = {
  applied: "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview Scheduled",
  offered: "Offer Extended",
  rejected: "Rejected",
};

const getStatusColor = (status) => {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800";
    case "interview":
      return "bg-purple-100 text-purple-800";
    case "shortlisted":
      return "bg-yellow-100 text-yellow-800";
    case "offered":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};