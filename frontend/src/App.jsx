import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import RequireAuth from "./routes/RequireAuth";

function Dashboard() {
  return <h2>Dashboard — Protected Page</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<Login />} />

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
