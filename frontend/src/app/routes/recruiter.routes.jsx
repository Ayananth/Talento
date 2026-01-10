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
import RecruiterProfilePage from "../../pages/recruiter/RecruiterProfilePage";
import RecruiterApplicationsListPage from "../../pages/recruiter/RecruiterApplicationsListPage";
import ApplicantDetailsPage from "../../pages/recruiter/ApplicantDetailsPage";
import MessagesPageResponsive from "../../pages/jobseeker/MessagesPageResponsive";
import JobseekerPremium from "../../pages/jobseeker/JobseekerPremium";

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
            path: "messages",
            element: <MessagesPageResponsive />,
          },



          {
            path: "jobs",
            element: <RecruiterJobsListPage />,
          },

          {
            path: "jobs/create",

            element: <CreateJobForm />,
          },

          {
            path: "jobs/:id",

            element: <RecruiterJobDetailPage />,
          },

          {
            path: "jobs/:id/edit",

            element: <RecruiterJobEditPage />,
          },
          {
            path: "profile",

            element: <RecruiterProfilePage />,
          },


          {
            path: "applications",
            element: <RecruiterApplicationsListPage />,
          },

          {
            path: "applications/:applicantId",
            element: <ApplicantDetailsPage />,
          },
          {
            path: "premium",
            element: <JobseekerPremium navigateTo="/recruiter/profile?payment=success" />,
          },












        ],
      },
    ],
  },
];

export default recruiterRoutes;
