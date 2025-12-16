import React from "react";
import heroImg1 from "@/assets/jobseeker/hero-1.png";
import heroImg2 from "@/assets/jobseeker/hero-2.png";

export default function JobseekerLandingPage() {
  return (
    <section className="relative bg-slate-50 overflow-hidden">
      {/* Background gradient shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            The <span className="text-blue-600">Easiest Way</span>
            <br /> to Get Your New Job
          </h1>

          <p className="mt-6 text-slate-600 max-w-xl">
            Each month, more than 3 million job seekers turn to website in their
            search for work, making over 140,000 applications every single day
          </p>

          {/* SEARCH BAR */}
          <div className="mt-10 bg-white shadow-xl rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
            
            <div className="flex items-center gap-2 w-full md:w-1/4">
              <span className="text-slate-400">🏢</span>
              <select className="w-full bg-transparent outline-none text-slate-700">
                <option>Industry</option>
                <option>IT</option>
                <option>Finance</option>
                <option>Design</option>
              </select>
            </div>

            <div className="hidden md:block h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2 w-full md:w-1/4">
              <span className="text-slate-400">📍</span>
              <select className="w-full bg-transparent outline-none text-slate-700">
                <option>Location</option>
                <option>Kochi</option>
                <option>Bangalore</option>
                <option>Remote</option>
              </select>
            </div>

            <div className="hidden md:block h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2 w-full md:flex-1">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Your keyword..."
                className="w-full outline-none text-slate-700"
              />
            </div>

            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg font-medium">
              Search
            </button>
          </div>

          {/* POPULAR SEARCHES */}
          <div className="mt-6 text-sm text-slate-500">
            Popular Searches:{" "}
            <span className="underline cursor-pointer">Designer</span>,{" "}
            <span className="underline cursor-pointer">Web</span>,{" "}
            <span className="underline cursor-pointer">iOS</span>,{" "}
            <span className="underline cursor-pointer">Developer</span>,{" "}
            <span className="underline cursor-pointer">PHP</span>,{" "}
            <span className="underline cursor-pointer">Senior</span>,{" "}
            <span className="underline cursor-pointer">Engineer</span>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="relative hidden lg:block">
          
          <div className="rounded-3xl overflow-hidden shadow-2xl w-[380px] ml-auto">
            <img
              src={heroImg1}
              alt="Team celebration"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -bottom-16 right-24 rounded-3xl overflow-hidden shadow-2xl w-[360px] border-8 border-blue-600">
            <img
              src={heroImg2}
              alt="Business meeting"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
