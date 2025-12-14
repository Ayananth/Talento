import React from 'react'
import { Navbar } from '../components/Navbar'
import Footer from '../../../shared/components/Footer'
import { Outlet } from 'react-router-dom'


const AuthenticationLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default AuthenticationLayout
