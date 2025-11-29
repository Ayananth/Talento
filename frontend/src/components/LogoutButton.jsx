// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // clear tokens + clear user
    navigate("/login");    // redirect to login
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: 20 }}>
      Logout
    </button>
  );
};

export default LogoutButton;
