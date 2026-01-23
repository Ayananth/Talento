import AuthenticationLayout from '../../layouts/common/AuthenticationLayout'
import LoginPage from '../../pages/common/LoginPage';
import SignupPage from '@/pages/common/SignupPage';
import EmailVerificationPage from '@/pages/common/EmailVerificationPage';
import ForgotPasswordPage from '@/pages/common/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/common/ResetPasswordPage'
import EmailSuccessPage from '@/pages/common/EmailSuccessPage'
import EmailFailedPage from '@/pages/common/EmailFailedPage'
import RedirectIfAuth from '../../auth/routes/RedirectIfAuth';

const authRoutes = [
  {

    // path: "/",
    element:<AuthenticationLayout />,
      children: [
        {
          path:"login",
          element:  (
            <RedirectIfAuth>
             <LoginPage role="jobseeker" />
            </RedirectIfAuth>
          )
        },
        {
          path:"recruiter/login",
          element: (
            <RedirectIfAuth>
              <LoginPage role="recruiter" />
            </RedirectIfAuth>
          
          )
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
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    { path: "/email-verified-success", element: <EmailSuccessPage /> },
    { path: "/email-verified-failed", element: <EmailFailedPage /> },






      ]
  },

];

export default authRoutes;
