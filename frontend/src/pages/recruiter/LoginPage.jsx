import { useState } from "react";
import { Navbar } from "../../components/recruiter/NavBar";
import LoginForm from "../../components/recruiter/LoginForm";
import Footer from "../../components/recruiter/Footer";


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
