import LoginPage from "../../features/auth/pages/LoginPage";
import AuthenticationLayout from "../../features/auth/layout/AuthenticationLayout";
import SignupPage from "../../features/auth/pages/SignupPage";

const authRoutes = [
  {

    element:<AuthenticationLayout />,
      children: [
        {
          path:"login",
          element: <LoginPage role="jobseeker" />
        },
        {
          path:"recruiter/login",
          element: <LoginPage role="recruiter" />
        },
        {
          path:"signup",
          element: <SignupPage role="jobseeker" />
        },
      ]
  },

];

export default authRoutes;
