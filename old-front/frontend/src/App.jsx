// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";

// route guards
import RequireAuth from "./routes/RequireAuth";
import RedirectIfAuth from "./routes/RedirectIfAuth";
import RoleRoute from "./routes/RoleRoute";

// ----- Shared auth / common pages -----
import NotFound from "./pages/common/NotFound";
import EmailVerificationPage from "./pages/seeker/EmailVerificationPage";
import EmailSuccessPage from "./pages/seeker/EmailSuccessPage";
import EmailFailedPage from "./pages/seeker/EmailFailedPage";
import ForgotPasswordPage from "./pages/seeker/ForgotPasswordPage";
import ResetPasswordPage from "./pages/seeker/ResetPasswordPage";

// ----- Jobseeker pages & layout -----
import LoginPage from "./pages/seeker/LoginPage"; // accepts prop role={"jobseeker"} optionally
import RegisterPage from "./pages/seeker/RegisterPage";
import JobseekerLayout from "./layouts/jobseeker/JobseekerLayout";
import JobseekerLanding from "./pages/seeker/Landing"; // index landing for jobseeker
import JobseekerDashboard from "./pages/seeker/Dashboard";

// ----- Recruiter pages & layout -----
import RecruiterLoginPage from "./pages/recruiter/LoginPage"; // or reuse LoginPage with role prop
import RecruiterRegisterPage from "./pages/recruiter/RegisterPage";
import RecruiterLayout from "./layouts/recruiter/RecruiterLayout";
import RecruiterLanding from "./pages/recruiter/RecruiterLanding";
import RecruiterDashboard from "./pages/recruiter/Dashboard";

// ----- Admin pages & layout -----
import AdminLoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./layouts/admin/AdminLayout";
import AdminLanding from "./pages/admin/Landing";
import AdminDashboard from "./pages/admin/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* <Route path="/logout" element={<Logout />} /> */}


          {/** ----------------- Public auth & misc pages (visible to logged out users) ----------------- **/}
          
          <Route
            path="/email-verification"
            element={
              <RedirectIfAuth>
                <EmailVerificationPage />
              </RedirectIfAuth>
            }
          />

          <Route
            path="/email-verified-success"
            element={
              <RedirectIfAuth>
                <EmailSuccessPage />
              </RedirectIfAuth>
            }
          />

          <Route
            path="/email-verified-failed"
            element={
              <RedirectIfAuth>
            <EmailFailedPage />
            </RedirectIfAuth>
            }

          />

          <Route
            path="/forgot-password"
            element={
              <RedirectIfAuth>
                <ForgotPasswordPage />
              </RedirectIfAuth>
            }
          />

          <Route
            path="/reset-password"
            element={
              <RedirectIfAuth>
                <ResetPasswordPage />
              </RedirectIfAuth>
            }
          />

          <Route path="/notfound" element={<NotFound />} />

          {/** ----------------- Jobseeker routes ----------------- **/}
          {/* Jobseeker auth pages - only shown to logged out users */}
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <LoginPage />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfAuth>
                <RegisterPage />
              </RedirectIfAuth>
            }
          />

          {/* Jobseeker protected area */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <RoleRoute allowedRoles={["jobseeker"]}>
                  <JobseekerLayout />
                </RoleRoute>
              </RequireAuth>
            }
          >
            {/* index = jobseeker landing */}
            <Route index element={<JobseekerLanding />} />
            <Route path="dashboard" element={<JobseekerDashboard />} />
            {/* add other jobseeker routes here, e.g. /profile, /jobs, /applications */}
          </Route>

          {/** ----------------- Recruiter routes ----------------- **/}
          {/* Recruiter auth pages */}
           <Route
            path="/recruiter/login"
            element={
              <RedirectIfAuth role="recruiter">
                <RecruiterLoginPage/> 
                {/* you can reuse LoginPage with prop */}
              </RedirectIfAuth>
            }
          />
          
          <Route
            path="/recruiter/signup"
            element={
              <RedirectIfAuth>
                <RecruiterRegisterPage />
              </RedirectIfAuth>
            }
          />

          {/* Recruiter protected area */}
          <Route
            path="/recruiter"
            element={
              <RequireAuth>
                <RoleRoute allowedRoles={["recruiter"]}>
                  <RecruiterLayout />
                </RoleRoute>
              </RequireAuth>
            }
          >
            <Route index element={<RecruiterLanding />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            {/* other recruiter routes: /recruiter/jobs, /recruiter/candidates */}
          </Route>

          {/** ----------------- Admin routes ----------------- **/}
          <Route
            path="/admin/login"
            element={
              <RedirectIfAuth role="admin">
                <AdminLoginPage />
              </RedirectIfAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAuth>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </RoleRoute>
              </RequireAuth>
            }
          >
            <Route index element={<AdminLanding />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* other admin routes: /admin/users, /admin/settings */}
          </Route>

          {/** Fallbacks */}
          {/* Redirect any unknown /admin/* or /recruiter/* to NotFound or their root */}
          <Route path="/admin/*" element={<Navigate to="/notfound" replace />} />
          <Route path="/recruiter/*" element={<Navigate to="/notfound" replace />} />

          {/* Generic catch-all - show NotFound or redirect to jobseeker landing */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
