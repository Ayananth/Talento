import Homepage from "../../features/jobseeker/home/Homepage";
import RequireAuth from "../../features/routes/RequireAuth";
import RoleRoute from "../../features/routes/RoleRoute";
import RecruiterListPage from "../../features/admin/recruiters/RecruiterListPage";
import AdminLayout from "../../features/admin/layout/AdminLayout";
import { Children } from "react";
import Dashboard from "../../features/admin/pages/Dashboard";
import AdminLoginPage from "../../features/admin/pages/AdminLoginPage";
import AdminReviewCompanyPage from "../../features/admin/recruiters/AdminReviewCompanyPage";
import PendingApprovalsPage from "../../features/admin/recruiters/PendingApprovalsPage";
import AdminApprovePage from "../../features/admin/recruiters/AdminApprovePage";


const adminRoutes = [
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <AdminLayout />
     </RequireAuth>
    ),
    children: [
      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          { path: "home", element: <Dashboard /> },
          { path: "recruiters", element: <RecruiterListPage /> },
          { path: "recruiter/changes", element: <AdminReviewCompanyPage /> },
          { path: "recruiter/approvals", element: <PendingApprovalsPage /> },
          { path: "recruiter/approvals/1", element: <AdminApprovePage /> },

        ]
      }
    ]
  },

    { path: "/admin/login", element: <AdminLoginPage role="admin" /> },

];



export default adminRoutes;
