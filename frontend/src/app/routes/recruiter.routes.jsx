import RecruiterRedirect from "@/auth/routes/RecruiterRedirect";
import ApprovedRecruiterGuard from "@/auth/routes/ApprovedRecruiterGuard";
import RecruiterEditAfterRejectionPage from "@/pages/recruiter/onboarding/RecruiterProfileEditAfterRejectionPage";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import RequireAuth from "@/auth/routes/RequireAuth";
import RecruiterLayout from "@/layouts/recruiter/RecruiterLayout";
import CreateJobForm from "../../components/recruiter/forms/CreateJobForm";
import RecruiterJobsListPage from "../../components/recruiter/RecruiterJobsListPage";
import RecruiterJobDetailPage from "../../pages/recruiter/RecruiterJobDetailPage";
import RecruiterJobEditPage from "../../pages/recruiter/RecruiterJobEditPage";

const recruiterRoutes = [
{
  path: "recruiter",
  element: <RequireAuth />,
  children: [
    {
      element: <RecruiterRedirect />,
      children: [
        {
          index: true,
          element: <RecruiterDashboard />,
        },
        {
          path: "dashboard",
          element: <RecruiterDashboard />,
        },
        {
          path: "jobs",
          element: <RecruiterJobsListPage />,
        },
      ],
    },
  ],
}

];

export default recruiterRoutes;
