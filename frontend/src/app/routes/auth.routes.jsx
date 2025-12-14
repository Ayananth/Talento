import AuthenticationLayout from '../../layouts/common/AuthenticationLayout'
import LoginPage from '../../pages/common/LoginPage';
import SignupPage from '@/pages/common/SignupPage';

const authRoutes = [
  {

    // path: "/",
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
