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
      /**
       * Default entry after login
       * /recruiter
       */
      // {
      //   index: true,
      //   element: <RecruiterRedirect />,
      // },

      /**
       * Accessible even if not approved
       * /recruiter/profile/resubmit
       */
      {
        path: "profile/resubmit",
        element: <RecruiterEditAfterRejectionPage />,
      },

      /**
       * Approved-only area
       * /recruiter/dashboard
       * /recruiter/jobs
       */
      {
        // element: <ApprovedRecruiterGuard />,
        children: [
          {
            element: <RecruiterLayout />,
            children: [
              {
                path: "dashboard",
                element: <RecruiterDashboard />,
              },
              {
                path: "jobs/create",
                element: <CreateJobForm />,
              },
              {
                path: "jobs",
                element: <RecruiterJobsListPage />,
              },
              {
                path: "jobs/:id",
                element: <RecruiterJobDetailPage/>
              },
              {
                path: "jobs/:id/edit",
                element: <RecruiterJobEditPage/>
              }
            ],
          },
        ],
      },
    ],
  },
];

export default recruiterRoutes;
