import RecruiterOnboardingPage from "../../pages/recruiter/onboarding/RecruiterOnboardingPage"
import VerificationPendingPage from "../../pages/recruiter/onboarding/VerificationPendingPage"

const recruiterRoutes =[
    {path:"recruiter/onboarding", element: <RecruiterOnboardingPage />},
    {path:"recruiter/verification-pending", element: <VerificationPendingPage />}
]
export default recruiterRoutes