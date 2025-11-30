import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import RequireAuth from "./routes/RequireAuth";
import RedirectIfAuth from "./routes/RedirectIfAuth";
import LogoutButton from "./components/LogoutButton";


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
              <Login />
            </RedirectIfAuth>
            
            
            
            } />

          <Route
            path="/signup"
            element={
              <RedirectIfAuth>
                <Signup />
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
