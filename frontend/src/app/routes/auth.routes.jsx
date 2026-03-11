import AuthenticationLayout from "../../layouts/common/AuthenticationLayout";
import EmailVerificationPage from "@/pages/common/EmailVerificationPage";
import ForgotPasswordPage from "@/pages/common/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/common/ResetPasswordPage";
import EmailSuccessPage from "@/pages/common/EmailSuccessPage";
import EmailFailedPage from "@/pages/common/EmailFailedPage";
import RedirectIfAuth from "../../auth/routes/RedirectIfAuth";
import JobseekerLoginPage from "@/pages/common/auth/JobseekerLoginPage";
import RecruiterLoginPage from "@/pages/common/auth/RecruiterLoginPage";
import JobseekerSignupPage from "@/pages/common/auth/JobseekerSignupPage";
import RecruiterSignupPage from "@/pages/common/auth/RecruiterSignupPage";

const authRoutes = [
  {
    element: <AuthenticationLayout role="jobseeker" />,
    children: [
      {
        path: "login",
        element: (
          <RedirectIfAuth>
            <JobseekerLoginPage />
          </RedirectIfAuth>
        ),
      },
      {
        path: "signup",
        element: (
          <RedirectIfAuth>
            <JobseekerSignupPage />
          </RedirectIfAuth>
        ),
      },
      { path: "/email-verification", element: <EmailVerificationPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/email-verified-success", element: <EmailSuccessPage /> },
      { path: "/email-verified-failed", element: <EmailFailedPage /> },
    ],
  },
  {
    element: <AuthenticationLayout role="recruiter" />,
    children: [
      {
        path: "recruiter/login",
        element: (
          <RedirectIfAuth>
            <RecruiterLoginPage />
          </RedirectIfAuth>
        ),
      },
      {
        path: "recruiter/signup",
        element: (
          <RedirectIfAuth>
            <RecruiterSignupPage />
          </RedirectIfAuth>
        ),
      },
    ],
  },
];

export default authRoutes;
