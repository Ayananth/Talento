import { Bell, Edit3, Search } from "lucide-react";
import useAuth from "../../auth/useAuth";

export default function TopNavbar() {
    const {logout} = useAuth()
  return (
    <header className="w-full bg-white border-b px-6 py-3 shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <img
              src="src/assets/react.svg"
              alt="JobBox"
              className="w-8 h-8 object-contain"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h1 className="text-xl font-semibold text-gray-900">Talento</h1>
          </div>

          {/* Admin Badge */}
          <span className="text-xs px-3 py-1 rounded-md bg-gray-100 border border-amber-50 text-gray-600">
            Admin area
          </span>
        </div>

        {/* CENTER SEARCH */}
        {/* <div className="flex-1 flex justify-center">
          <div className="w-[360px] flex items-center gap-2 bg-white border rounded-xl px-4 py-2 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="text-sm w-full outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div> */}

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">

          {/* Post Job */}
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <Edit3 size={16} />
            Post Job
          </button>

          {/* Notification */}
          <div className="relative cursor-pointer">
            <Bell size={22} className="text-gray-700" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="/avatar.jpg"
              alt="User"
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div onClick={()=> logout()}>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                Steven Jobs
              </p>
              <p className="text-[11px] text-gray-500 leading-tight -mt-1">
                Super Admin
              </p>

            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
