import RecruiterCard from "./RecruiterCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RECRUITERS = [
  {
    name: "LinkedIn",
    logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 68,
    location: "New York, US",
    openJobs: 25,
  },
  {
    name: "Adobe",
    logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 42,
    location: "New York, US",
    openJobs: 17,
  },
  {
    name: "Dailymotion",
    logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 46,
    location: "New York, US",
    openJobs: 65,
  },
  {
    name: "NewSum",
    logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 68,
    location: "New York, US",
    openJobs: 25,
  },
  {
    name: "PowerHome",
    logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
    reviews: 87,
    location: "New York, US",
    openJobs: 34,
  },
//   {
//     name: "Whop.com",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 34,
//     location: "New York, US",
//     openJobs: 56,
//   },
//   {
//     name: "Greewood",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 124,
//     location: "New York, US",
//     openJobs: 78,
//   },
//   {
//     name: "Kentucky",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 54,
//     location: "New York, US",
//     openJobs: 98,
//   },
//   {
//     name: "Queity",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 76,
//     location: "New York, US",
//     openJobs: 90,
//   },
//   {
//     name: "Honda",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 89,
//     location: "New York, US",
//     openJobs: 34,
//   },
//   {
//     name: "Toyota",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 34,
//     location: "New York, US",
//     openJobs: 26,
//   },
//   {
//     name: "Lexus",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 27,
//     location: "New York, US",
//     openJobs: 54,
//   },
//   {
//     name: "Ondo",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 54,
//     location: "New York, US",
//     openJobs: 58,
//   },
//   {
//     name: "Square",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 16,
//     location: "New York, US",
//     openJobs: 37,
//   },
//   {
//     name: "Vista",
//     logo:"https://img.freepik.com/premium-vector/square-linkedin-logo-isolated-white-background_469489-892.jpg?semt=ais_hybrid&w=740&q=80",
//     reviews: 97,
//     location: "New York, US",
//     openJobs: 43,
//   },
];

export default function TopRecruiters() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Top Recruiters
          </h1>
          <p className="mt-3 text-slate-500">
            Discover your next career move, freelance gig, or internship
          </p>
        </div>



        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {RECRUITERS.map((recruiter, index) => (
            <RecruiterCard key={index} recruiter={recruiter} />
          ))}
        </div>
      </div>
    </section>
  );
}
