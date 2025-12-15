import RecruiterRedirect from "@/auth/routes/RecruiterRedirect";
import ApprovedRecruiterGuard from "@/auth/routes/ApprovedRecruiterGuard";
import RecruiterEditAfterRejectionPage from "../../pages/recruiter/onboarding/RecruiterProfileEditAfterRejectionPage";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import RequireAuth from "../../auth/routes/RequireAuth"

const recruiterRoutes = [
  {
    path: "recruiter",
    element: <RequireAuth/>,
    children: [
      /**
       * DEFAULT entry after login
       * /recruiter
       */
      {
        index: true,
        element: <RecruiterRedirect />,
      },
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
            path: "dashboard",
            element: <RecruiterDashboard />,
          },
        //   {
        //     path: "jobs",
        //     element: <RecruiterJobsPage />,
        //   },
        ],
      },
    ],
  },
];

export default recruiterRoutes;
