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
import ForgotPasswordPage from "./pages/seeker/ForgotPasswordPage";
import ResetPasswordPage from "./pages/seeker/ResetPasswordPage";
import JobseekerLayout from "./layouts/jobseeker/JobseekerLayout";
import Landing from "./pages/seeker/Landing";
import Dashboard from "./pages/seeker/Dashboard";
import RoleRoute from "./routes/RoleRoute";
import NotFound from "./pages/common/NotFound";



function SampleSearch() {
  return(
    <>
    <h2>Sample search</h2>;
    </>
  ) 
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =======================================================
               1) PUBLIC AUTH PAGES (VISIBLE ONLY IF LOGGED OUT)
          ========================================================= */}

          {/* Shared public pages */}
          <Route path="/email-verification" element={<EmailVerificationPage />} />
          <Route path="/email-verified-success" element={<EmailSuccessPage />} />
          <Route path="/email-verified-failed" element={<EmailFailedPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/notfound" element={<NotFound />} />


          {/* =======================================================
               2) JOBSEEKER ROUTES
          ========================================================= */}
          {/* Jobseeker Login Pages */}
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

          {/* Jobseeker Protected Routes */}
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
            <Route index element={<Landing />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>



























          {/* Public */}
          {/* <Route path="/login" element={
            
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
          /> */}

          {/* Protected route */}
          {/* <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          /> */}

        {/* <Route path="/email-verification" element={
        <RedirectIfAuth>
          <EmailVerificationPage />
          </RedirectIfAuth>
  } />

          <Route path="/email-verified-success" element={<EmailSuccessPage />} />
          <Route path="/email-verified-failed" element={<EmailFailedPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} /> */}

          
          {/* Optional: redirect root to dashboard */}
          {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}


{/* 
==========================Job seeker=================================================

*/}

          {/* <Route
            path="/"
            element={
                <JobseekerLayout />
            }
          >
            <Route index element={<Landing />} />


            <Route path="dashboard" element={
              <RequireAuth>
              <Dashboard/>
              </RequireAuth>
              } />


          </Route> */}

{/* =================================================================== */}


{/* ===============Jobseeker login===================================== */}




{/* ===================================================================== */}


{/* ===============Recruiter login===================================== */}


{/* ===================================================================== */}



          


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
