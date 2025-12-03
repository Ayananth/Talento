import { useState } from "react";
import { Navbar } from "../../components/recruiter/NavBar";
import SignUpForm from "../../components/recruiter/SignUpForm";



const LoginPage = ({role}) => {
  return (
    <div>
        <Navbar/>
        <SignUpForm/>
    </div>
  )
}

export default LoginPage
