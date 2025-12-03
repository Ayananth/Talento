import { useState } from "react";
import { Navbar } from "../../components/admin/NavBar";
import LoginForm from "../../components/admin/LoginForm";





const LoginPage = () => {

  return (
    <div>
      <Navbar/>
        <LoginForm/>
    </div>
  )
}

export default LoginPage
