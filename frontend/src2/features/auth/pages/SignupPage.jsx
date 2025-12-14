import React from 'react'
import SignupForm from '../components/SignupForm'



const SignupPage = ({ role = "jobseeker" }) => {
  return (
    <div className="flex justify-center items-center py-20 mt-5 px-4">
      <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-white/40">
        
        {/* LEFT SECTION – BRANDING / WELCOME */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br  from-blue-600 to-indigo-700 text-white p-10">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Create Your Talento Account
          </h1>
          <p className="text-lg opacity-90">
            Register now and take the first step toward your dream career!
          </p>

          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/account-creation-10263737-8293836.png"
            alt="Register Illustration"
            className="w-80 mt-10 drop-shadow-2xl"
          />
        </div>

        {/* RIGHT SECTION – REGISTRATION FORM */}
        <div className="w-full lg:w-1/2 p-10">
          <SignupForm role={role} />
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
