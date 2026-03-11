import React from 'react'
import {Navbar} from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Outlet } from 'react-router-dom'


const AuthenticationLayout = ({ role = "jobseeker" }) => {
  return (
    <div>
      <Navbar role={role} />
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default AuthenticationLayout
