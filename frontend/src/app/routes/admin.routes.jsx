import Homepage from "../../features/jobseeker/home/Homepage";
import RequireAuth from "../../features/routes/RequireAuth";
import RoleRoute from "../../features/routes/RoleRoute";
import RecruiterListPage from "../../features/admin/recruiters/RecruiterListPage";
import AdminLayout from "../../features/admin/layout/AdminLayout";
import { Children } from "react";
import Dashboard from "../../features/admin/pages/Dashboard";


const adminRoutes = [
  {
    path: "/admin",
    element: (
    //   <RequireAuth>
        <AdminLayout />
    //   </RequireAuth>
    ),
    children: [
      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "recruiters", element: <RecruiterListPage /> }
        ]
      }
    ]
  }
];



export default adminRoutes;
