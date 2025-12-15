import EmailVerifiedSuccess from "@/components/common/EmailVerifiedSuccess";

export default function EmailSuccessPage() {
  return (
    <div className="flex justify-center items-center py-20 mt-5 px-4">
      <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-white/40">

        {/* LEFT – Illustration / Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 text-white p-10">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Email Verified 🎉
          </h1>

          <p className="text-lg opacity-90 text-center">
            Your account is now activated.  
            You can safely log in and continue your journey.
          </p>

          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/email-confirmed-10263739-8293845.png"
            alt="Email Verified Illustration"
            className="w-80 mt-10 drop-shadow-2xl"
          />
        </div>

        {/* RIGHT – Success message card */}
        <div className="w-full lg:w-1/2 p-10">
          <EmailVerifiedSuccess />
        </div>

      </div>
    </div>
  );
}
