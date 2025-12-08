import LoginPage from "../../features/auth/pages/LoginPage";
import AuthenticationLayout from "../../features/auth/layout/AuthenticationLayout";
import SignupPage from "../../features/auth/pages/SignupPage";
import EmailVerificationPage from "../../features/auth/pages/EmailVerificationPage";
import EmailSuccessPage from "../../features/auth/pages/EmailSuccessPage";
import EmailFailedPage from "../../features/auth/pages/EmailFailedPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../../features/auth/pages/ResetPasswordPage";

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
        {
          path:"/email-verification",
          element: <EmailVerificationPage />
        },
        {
          path:"/email-verified-success",
          element: <EmailSuccessPage />
        },
        {
          path:"/email-verified-failed",
          element: <EmailFailedPage />
        },
        {
          path:"/forgot-password",
          element: <ForgotPasswordPage />
        },
        {
          path:"/reset-password",
          element: <ResetPasswordPage />
        }
      ]
  },

];

export default authRoutes;

