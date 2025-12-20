import HomePage from "../../pages/jobseeker/HomePage";
import RequireAuth from "@/auth/routes/RequireAuth";
import RoleRoute from "@/auth/routes/RoleRoute";
import Dashboard from "../../pages/jobseeker/Dashboard";
import DashboardLayout from "@/layouts/jobseeker/DashboardLayout";
import LandingLayout from "../../layouts/jobseeker/LandingLayout";
import Profile from "../../pages/jobseeker/Profile";
import JobseekerLandingPage from "../../pages/jobseeker/JobseekerLandingPage";
import JobSearchPage from "../../pages/jobseeker/JobSearchPage";
import JobDetailPage from "../../pages/jobseeker/JobDetailPage";

const jobseekerRoutes = [
  {
    element: <RequireAuth />,
    children: [
      {
        element: <RoleRoute allowedRoles={["jobseeker"]} />,
        children: [{ path: "/profile", element: <Dashboard /> }],
      },
    ],
  },

  {
    element: <LandingLayout />,
    children: [
      { path: "/", element: <JobseekerLandingPage /> },
      {path: "/jobsearch", element: <JobSearchPage/>},
      {path: "/jobs/:id", element: <JobDetailPage/>},


    
    ],
  },

  {
    path:"/profile",
    element: (
      // <RequireAuth>
        <DashboardLayout />
      // </RequireAuth>
    ),

    children: [
      {
        element: <RoleRoute allowedRoles={["jobseeker"]} />,
        children: [{ path: "", element: <Profile /> }],
      },
    ],
  },
];

export default jobseekerRoutes;
