import React from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <>


      <div className="flex justify-center items-center py-20 mt-5 px-4">
        <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl 
                        overflow-hidden border border-white/40">

          {/* LEFT – Illustration / branding */}
          <div className="hidden lg:flex flex-col justify-center items-center w-1/2 
              bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-10">

            <h1 className="text-4xl font-bold mb-4 tracking-tight text-center">
              Reset Your Password
            </h1>

            <p className="text-lg opacity-90 text-center">
              Create a new password to secure your account.
            </p>

            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/password-security-10263736-8293834.png"
              alt="Reset Password Illustration"
              className="w-80 mt-10 drop-shadow-2xl"
            />
          </div>

          {/* RIGHT – Actual Form */}
          <div className="w-full lg:w-1/2 p-10">
            <ResetPasswordForm />
          </div>

        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
