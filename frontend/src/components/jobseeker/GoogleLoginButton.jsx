import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import api from "../../apis/api";
import { saveTokens } from "../../auth/authUtils";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";



const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton({role}) {
    const { googleLogin } = useAuth();
    const navigate = useNavigate()
  const handleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;


    try {
      const res = await api.post("/v1/auth/google-login/", { id_token, role });

      if (res.status !== 200) {
        console.error("Google login failed:", res.data);
        return;
      }

      // Your backend returns { access, refresh, user }
        const { access, refresh, user } = res.data;

        googleLogin({access, refresh, role}); 


      navigate("/");

    } catch (err) {
      console.error("Error sending Google ID token:", err);
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
