import React from 'react'

const Dashboard = () => {
  return (


           <>
             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Dashboard</h2>
             <p className="text-gray-600">
               Welcome to the admin panel. Select an option from the sidebar.
             </p>

             {/* Example Dashboard Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
               <div className="p-6 bg-blue-100 rounded-xl shadow hover:shadow-md transition">
                 <h3 className="text-lg font-semibold text-blue-700">Total Companies</h3>
                 <p className="text-3xl font-bold mt-2 text-blue-900">120</p>
               </div>

               <div className="p-6 bg-indigo-100 rounded-xl shadow hover:shadow-md transition">
                 <h3 className="text-lg font-semibold text-indigo-700">Pending Approvals</h3>
                 <p className="text-3xl font-bold mt-2 text-indigo-900">8</p>
               </div>

               <div className="p-6 bg-green-100 rounded-xl shadow hover:shadow-md transition">
                 <h3 className="text-lg font-semibold text-green-700">Active Jobs</h3>
                 <p className="text-3xl font-bold mt-2 text-green-900">56</p>
               </div>
             </div>
           </>

  )
}

export default Dashboard
