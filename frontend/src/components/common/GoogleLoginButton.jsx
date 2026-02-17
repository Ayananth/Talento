import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import api from '../../apis/api'
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/context/useAuth";




const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton({role, setAuthError}) {
    const { googleLogin } = useAuth();
    const navigate = useNavigate()

const normalizeMessage = (raw, fallback) => {
  const msg = typeof raw === "string" ? raw.trim() : "";
  if (!msg || /^\d{3}$/.test(msg)) return fallback;
  return msg;
};

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
        message = normalizeMessage(data, message);
      } else if (data.detail) {
        message = normalizeMessage(data.detail, message);
      } else if (data.message) {
        message = normalizeMessage(data.message, message);
      }
    } else if (err.request) {
      message = "Server not reachable. Please try again later.";
    }
    if (typeof setAuthError === "function") {
      setAuthError(message);
    }
    // throw new Error(message);
  }
};


  const handleError = () => {
    if (typeof setAuthError === "function") {
      setAuthError("Google login failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
}