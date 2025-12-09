import React from "react";
import EmailVerifiedFailed from "../components/EmailVerifiedFailed";

const EmailFailedPage = () => {
  return (
    <>

      <div className="flex justify-center items-center py-20 mt-5 px-4">
        <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-white/40">

          {/* LEFT – Illustration / Branding */}
          <div className="hidden lg:flex flex-col justify-center items-center w-1/2 
            bg-gradient-to-br from-red-600 to-rose-700 text-white p-10">
            
            <h1 className="text-4xl font-bold mb-4 text-center">
              Verification Failed
            </h1>

            <p className="text-lg opacity-90 text-center">
              The verification link may have expired or is invalid.  
              You can request a new one.
            </p>

            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/email-error-10263740-8293846.png"
              alt="Email Error Illustration"
              className="w-80 mt-10 drop-shadow-2xl"
            />
          </div>

          {/* RIGHT – Message Card */}
          <div className="w-full lg:w-1/2 p-10">
            <EmailVerifiedFailed />
          </div>

        </div>
      </div>
    </>
  );
};

export default EmailFailedPage;
