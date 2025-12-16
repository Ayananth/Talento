import RecruiterRedirect from "@/auth/routes/RecruiterRedirect";
import ApprovedRecruiterGuard from "@/auth/routes/ApprovedRecruiterGuard";
import RecruiterEditAfterRejectionPage from "@/pages/recruiter/onboarding/RecruiterProfileEditAfterRejectionPage";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import RequireAuth from "@/auth/routes/RequireAuth";
import RecruiterLayout from "@/layouts/recruiter/RecruiterLayout";

const recruiterRoutes = [
  {
    path: "recruiter",
    element: <RequireAuth />,
    children: [
      /**
       * Default entry after login
       * /recruiter
       */
      {
        index: true,
        element: <RecruiterRedirect />,
      },

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
        element: <ApprovedRecruiterGuard />,
        children: [
          {
            element: <RecruiterLayout />,
            children: [
              {
                path: "dashboard",
                element: <RecruiterDashboard />,
              },
              // {
              //   path: "jobs",
              //   element: <RecruiterJobsPage />,
              // },
            ],
          },
        ],
      },
    ],
  },
];

export default recruiterRoutes;
