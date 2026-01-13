import { createBrowserRouter } from "react-router-dom";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <LoginPage  role={"jobseeker"}/>,
//   },
// ]);

// export default router;

// import authRoutes from "./auth.routes";

// const router = createBrowserRouter([
//   authRoutes,
// ]);

// export default router;

import authRoutes from "./auth.routes";
import jobseekerRoutes from "./jobseeker.routes";
import commonRoutes from "./common.routes.jsx";
import adminRoutes from "./admin.routes"
import recruiterRoutes from "./recruiter.routes.jsx";


const router = createBrowserRouter([
  ...authRoutes,
  ...jobseekerRoutes,
  ...commonRoutes,
  ...adminRoutes,
  ...recruiterRoutes


]);

export default router;

