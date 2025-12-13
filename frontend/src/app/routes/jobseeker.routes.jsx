
import Homepage from "../../features/jobseeker/home/Homepage";
import RequireAuth from "../../features/routes/RequireAuth";
import RoleRoute from "../../features/routes/RoleRoute";
import Dashboard from "../../../../old-front/frontend/src/pages/seeker/Dashboard";

const jobseekerRoutes = [
{
  element: <RequireAuth />,
  children: [
    {
      element: <RoleRoute allowedRoles={["jobseeker"]} />,
      children: [
        { path: "/", element: <Homepage /> },
        { path: "/profile", element: <Dashboard /> },
      ]
    }
  ]
}


];

export default jobseekerRoutes;
