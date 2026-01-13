import React from "react";
import ForgotPasswordForm from "@/components/common/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <>

      <div className="flex justify-center items-center py-20 mt-5 px-4">
        <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-white/40">

          {/* LEFT – Illustration */}
          <div className="hidden lg:flex flex-col justify-center items-center w-1/2 
              bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
            
            <h1 className="text-4xl font-bold mb-4 text-center tracking-tight">
              Forgot Password?
            </h1>

            <p className="text-lg opacity-90 text-center">
              Don't worry!  
              Enter your email to reset your password.
            </p>

            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/reset-password-10263735-8293833.png"
              alt="Forgot Password Illustration"
              className="w-80 mt-10 drop-shadow-2xl"
            />
          </div>

          {/* RIGHT – Form */}
          <div className="w-full lg:w-1/2 p-10">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
