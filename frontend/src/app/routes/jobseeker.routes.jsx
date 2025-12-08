
import LoginPage from "../../features/auth/pages/LoginPage";
import AuthenticationLayout from "../../features/auth/layout/AuthenticationLayout";
import SignupPage from "../../features/auth/pages/SignupPage";

import Homepage from "../../features/jobseeker/home/Homepage";

const jobseekerRoutes = [
  {
    path: "/",
    element: <Homepage />
  }

];

export default jobseekerRoutes;
