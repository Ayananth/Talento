import React from 'react'
import {Navbar} from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
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
