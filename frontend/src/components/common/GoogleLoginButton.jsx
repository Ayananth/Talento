import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import api from '../../apis/api'
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/context/useAuth";




const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton({role, setLoginError}) {
    const { googleLogin } = useAuth();
    const navigate = useNavigate()


const handleSuccess = async (credentialResponse) => {
  const id_token = credentialResponse.credential;

  try {
    const res = await api.post("/v1/auth/google-login/", {
      id_token,
      role,
    });

    const { access, refresh } = res.data;

    googleLogin({ access, refresh, role });

    // Role-based redirect
    const redirectMap = {
      jobseeker: "/",
      recruiter: "/recruiter",
      admin: "/admin",
    };

    navigate(redirectMap[role] ?? "/");

  } catch (err) {
    let message = "Google login failed. Please try again.";

    if (err.response?.data) {
      const data = err.response.data;

      if (typeof data === "string") {
        message = data;
      } else if (data.detail) {
        message = data.detail;
      } else if (data.message) {
        message = data.message;
      }
    } else if (err.request) {
      message = "Server not reachable. Please try again later.";
    }
    setLoginError(message)
    // throw new Error(message);
  }
};


  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
}
