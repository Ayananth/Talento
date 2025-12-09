
import Homepage from "../../features/jobseeker/home/Homepage";
import RequireAuth from "../../features/routes/RequireAuth";
import RoleRoute from "../../features/routes/RoleRoute";

const jobseekerRoutes = [
{
  element: <RequireAuth />,
  children: [
    {
      element: <RoleRoute allowedRoles={["jobseeker"]} />,
      children: [
        { path: "/", element: <Homepage /> },
        { path: "/profile", element: <Homepage /> },
      ]
    }
  ]
}


];

export default jobseekerRoutes;
