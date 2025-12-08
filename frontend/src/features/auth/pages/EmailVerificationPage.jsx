import EmailVerification from "../components/EmailVerification";

export default function EmailVerificationPage() {
  return (
    <div className="flex justify-center items-center py-20 mt-5 px-4">
      <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-white/40">

        {/* LEFT – Branding with illustration */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-10">
          <h1 className="text-4xl font-bold mb-4">
            Verify Your Email
          </h1>

          <p className="text-lg opacity-90 text-center">
            Your account is almost ready!  
            Please confirm your email to continue.
          </p>

          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/email-verification-10263741-8293847.png"
            alt="Verify Email Illustration"
            className="w-80 mt-10 drop-shadow-2xl"
          />
        </div>

        {/* RIGHT – Actual component */}
        <div className="w-full lg:w-1/2 p-10">
          <EmailVerification />
        </div>

      </div>
    </div>
  );
}
