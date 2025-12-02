import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  return (
    <nav className="bg-white w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">

        {/* Brand */}
        <div className="flex items-center space-x-3">
          <img src="/src/assets/react.svg" alt="logo" className="h-8 w-8" />
          <span className="text-2xl font-semibold text-gray-800 tracking-tight">Talento</span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center space-x-10 text-lg">
          <a className="text-gray-700 hover:text-blue-600 transition">Home</a>
          <a className="text-gray-700 hover:text-blue-600 transition">Jobs</a>
          <a className="text-gray-700 hover:text-blue-600 transition">About</a>
          <a className="text-gray-700 hover:text-blue-600 transition">Contact</a>
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
          onClick={()=> navigate('/login')}
          className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition">
            Login
          </button>

          <button
          onClick={()=> navigate('/signup')}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Sign Up
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col space-y-3 px-6 pb-4 border-t pt-3">
          <a className="text-gray-700 hover:text-blue-600 transition">Home</a>
          <a className="text-gray-700 hover:text-blue-600 transition">Jobs</a>
          <a className="text-gray-700 hover:text-blue-600 transition">About</a>
          <a className="text-gray-700 hover:text-blue-600 transition">Contact</a>

          <button onClick={()=> navigate('/login')} className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
            Login
          </button>

          <button onClick={()=> navigate('/signup')} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}


