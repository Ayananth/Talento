import AuthenticationLayout from '../../layouts/common/AuthenticationLayout'
import LoginPage from '../../pages/common/LoginPage';
import SignupPage from '@/pages/common/SignupPage';
import EmailVerificationPage from '@/pages/common/EmailVerificationPage';

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
        {
          path:"recruiter/signup",
          element: <SignupPage role="recruiter" />
        },


    { path: "/email-verification", element: <EmailVerificationPage /> },
    // { path: "/forgot-password", element: <ForgotPasswordPage /> },
    // { path: "/reset-password", element: <ResetPasswordPage /> },
    // { path: "/email-verified-success", element: <EmailSuccessPage /> },
    // { path: "/email-verified-failed", element: <EmailFailedPage /> },






      ]
  },

];

export default authRoutes;
