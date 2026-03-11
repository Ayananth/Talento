import React from "react";
import SignupForm from "@/components/common/SignupForm";

const JobseekerSignupPage = () => {
  return (
    <div className="flex justify-center items-center py-20 mt-5 px-4">
      <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-white/40">
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Create Your Jobseeker Account
          </h1>
          <p className="text-lg opacity-90">
            Register now and start applying to roles that match your profile.
          </p>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/account-creation-10263737-8293836.png"
            alt="Jobseeker signup"
            className="w-80 mt-10 drop-shadow-2xl"
          />
        </div>
        <div className="w-full lg:w-1/2 p-10">
          <SignupForm role="jobseeker" loginPath="/login" showGoogleLogin={true} />
        </div>
      </div>
    </div>
  );
};

export default JobseekerSignupPage;
