import { useState } from "react";
import { Navbar } from "../../components/seeker/NavBar";
import LoginForm from "../../components/seeker/LoginForm";
import Footer from "../../components/seeker/Footer";



const LoginPage = () => {



  return (
    <div>
        <Navbar/>
        <LoginForm/>
        <Footer />
    </div>
  )
}

export default LoginPage
