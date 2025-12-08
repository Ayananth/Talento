import React from 'react'
import LoginForm from '../components/LoginForm'


const LoginPage = ({role="jobseeker"}) => {
  console.log("Login page callled")
  return (

      <div className="flex justify-center items-center py-20 mt-5 px-4">
        <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden border border-white/40">

          {/* LEFT SECTION – ILLUSTRATION / BRANDING */}
          <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Welcome Back to Talento
            </h1>
            <p className="text-lg opacity-90">
              Your career journey continues here.  
              Login and discover new opportunities!
            </p>

            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/login-secured-10263738-8293843.png"
              className="w-80 mt-10 drop-shadow-2xl"
            />
          </div>
      <div className="w-full lg:w-1/2 p-10">
        <LoginForm />
      </div>


        </div>
      </div>















  )
}

export default LoginPage
