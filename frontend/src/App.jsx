import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Signup from "./components/seeker/SignUp";
import RequireAuth from "./routes/RequireAuth";
import RedirectIfAuth from "./routes/RedirectIfAuth";
import LogoutButton from "./components/seeker/LogoutButton";
import LoginPage from "./pages/seeker/LoginPage";
import RegisterPage from "./pages/seeker/RegisterPage";

function Dashboard() {
  return(
    <>
    <h2>Dashboard — Protected Page</h2>;
    <LogoutButton/>
    </>
  ) 
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public */}
          <Route path="/login" element={
            
            <RedirectIfAuth>
              <LoginPage />
            </RedirectIfAuth>
            
            
            
            } />

          <Route
            path="/signup"
            element={
              <RedirectIfAuth>
                <RegisterPage />
              </RedirectIfAuth>
            }
          />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          {/* Optional: redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
