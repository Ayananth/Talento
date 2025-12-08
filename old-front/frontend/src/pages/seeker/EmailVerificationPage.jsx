import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../apis/api";
import EmailVerification from "../../components/seeker/EmailVerification";
import { Navbar } from "../../components/seeker/NavBar";

export default function EmailVerificationPage() {


  return (
    <>
    <Navbar/>
    <EmailVerification/>
    
    </>

  );
}
