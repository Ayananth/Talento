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

const adminRoutes = [
  {
    path: "/admin",
    element: (

    //   <RequireAuth>
        <AdminLayout />
    //  </RequireAuth>

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
