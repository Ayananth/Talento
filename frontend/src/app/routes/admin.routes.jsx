// import AdminReviewCompanyPage from "../../features/admin/recruiters/AdminReviewCompanyPage";
// import PendingApprovalsPage from "../../features/admin/recruiters/PendingApprovalsPage";

import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import RequireAuth from "@/auth/routes/RequireAuth";
import RoleRoute from "@/auth/routes/RoleRoute";
import RedirectIfAuth from "@/auth/routes/RedirectIfAuth";
import Dashboard from "@/pages/admin/Dashboard";
import AdminLayout from "@/layouts/admin/AdminLayout";
import RecruiterListPage from "@/pages/admin/RecruiterListPage";
import AdminReviewCompanyPage from "@/pages/admin/AdminReviewCompanyPage";
import PendingApprovalsPage from "@/pages/admin/PendingApprovalsPage";
import AdminApprovePage from "@/pages/admin/AdminApprovePage";
import AdminUsersPage from "../../pages/admin/users/AdminUsersPage";
import AdminUserDetailPage from "../../pages/admin/users/AdminUserDetailPage";
import AdminJobsPage from "../../pages/admin/jobs/AdminJobsPage";
import AdminJobDetailPage from "../../pages/admin/jobs/AdminJobDetailPage";
import { AdminProvider } from "../../context/AdminContext";

const adminRoutes = [
  {
    path: "/admin",
    element: (

      <RequireAuth>
        <AdminProvider>
        <AdminLayout />
        </AdminProvider>
    //  </RequireAuth>

    ),
    children: [
      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          { index:true , element: <Dashboard /> },
          { path: "recruiters", element: <RecruiterListPage /> },
          { path: "recruiter/changes", element: <AdminReviewCompanyPage /> },
          { path: "recruiter/approvals", element: <PendingApprovalsPage /> },
          { path: "recruiter/approvals/:id", element: <AdminApprovePage /> },


          { path: "users", element: <AdminUsersPage /> },

          {
            path: "users/:id",element: <AdminUserDetailPage />,
          },
          {
            path: "jobs/",element: <AdminJobsPage />,
          },
          {
            path: "/admin/jobs/:id",
            element: <AdminJobDetailPage />,
          }

        ]
      }
    ]
  },

    { path: "/admin/login", element: <AdminLoginPage role="admin" /> },

];



export default adminRoutes;
