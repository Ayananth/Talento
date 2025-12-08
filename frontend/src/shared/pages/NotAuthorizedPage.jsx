import React from "react";
import { Navbar } from "../../features/auth/components/Navbar";
import NotAuthorized from "../components/NotAuthorized";
import Footer from "../components/Footer";

const NotAuthorizedPage = () => {
  return (
    <>

      <div className="flex justify-center items-center py-20 mt-5 px-4">
        <div className="flex w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl 
                        overflow-hidden border border-white/40">

          {/* LEFT – Illustration */}
          <div className="hidden lg:flex flex-col justify-center items-center w-1/2 
              bg-gradient-to-br from-rose-600 to-red-700 text-white p-10">

            <h1 className="text-4xl font-bold mb-4 tracking-tight text-center">
              Access Denied
            </h1>

            <p className="text-lg opacity-90 text-center">
              You don't have permission to view this page.
            </p>

            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/access-denied-10263733-8293831.png"
              alt="Access Denied Illustration"
              className="w-80 mt-10 drop-shadow-2xl"
            />
          </div>

          {/* RIGHT – Message Card */}
          <div className="w-full lg:w-1/2 p-10">
            <NotAuthorized />
          </div>

        </div>
      </div>

    </>
  );
};

export default NotAuthorizedPage;
