import React from 'react'
import { Navbar } from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Outlet } from 'react-router-dom'

const LandingLayout = () => {
  return (
    <div>
        <Navbar />
        <div className='mt-20'></div>
        <Outlet />
        <Footer/>
      
    </div>
  )
}

export default LandingLayout
