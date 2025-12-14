import RecruiterOnboardingPage from "../../pages/recruiter/onboarding/RecruiterOnboardingPage"
import VerificationPendingPage from "../../pages/recruiter/onboarding/VerificationPendingPage"
import VerificationRejectedPage from "../../pages/recruiter/onboarding/VerificationRejectedPage"

const recruiterRoutes =[
    {path:"recruiter/onboarding", element: <RecruiterOnboardingPage />},
    {path:"recruiter/verification-pending", element: <VerificationPendingPage />},
    {path:"recruiter/verification-rejected", element: <VerificationRejectedPage />},
]
export default recruiterRoutes