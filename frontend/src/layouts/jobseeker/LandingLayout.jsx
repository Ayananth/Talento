import React from 'react'
import { Navbar } from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

const LandingLayout = () => {
  return (
    <div>
        <Navbar />
        <div className='mt-20'></div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
        <Outlet />
        <Footer/>
      
    </div>
  )
}

export default LandingLayout
