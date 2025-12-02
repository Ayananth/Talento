import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./routes/RequireAuth";
import RedirectIfAuth from "./routes/RedirectIfAuth";
import LogoutButton from "./components/seeker/LogoutButton";
import LoginPage from "./pages/seeker/LoginPage";
import RegisterPage from "./pages/seeker/RegisterPage";
import EmailVerificationPage from "./pages/seeker/EmailVerificationPage";
import EmailSuccessPage from "./pages/seeker/EmailSuccessPage";
import EmailFailedPage from "./pages/seeker/EmailFailedPage";

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

        <Route path="/email-verification" element={
        <RedirectIfAuth>
          <EmailVerificationPage />
          </RedirectIfAuth>
  } />

          <Route path="/email-verified-success" element={<EmailSuccessPage />} />
          <Route path="/email-verified-failed" element={<EmailFailedPage />} />





          {/* Optional: redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
