import { useState } from "react";
import { Navbar } from "../../components/seeker/NavBar";
import SignUpForm from "../../components/seeker/SignUpForm";



const LoginPage = ({role}) => {
  return (
    <div>
        <Navbar/>
        <SignUpForm role={role}/>
    </div>
  )
}

export default LoginPage
