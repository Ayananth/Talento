import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";

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

const router = createBrowserRouter([
  ...authRoutes, 
]);

export default router;
