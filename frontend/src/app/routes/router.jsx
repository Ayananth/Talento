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


const router = createBrowserRouter([
  ...authRoutes,
  ...jobseekerRoutes,
  ...commonRoutes,
  ...adminRoutes

]);

export default router;

