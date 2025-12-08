import NotAuthorizedPage from "../../shared/pages/NotAuthorizedPage";
import AuthenticationLayout from "../../features/auth/layout/AuthenticationLayout";


const commonRoutes = [
{
  element: (
      <AuthenticationLayout />
  ),
  children: [

    { path: "/not-authorized", element: <NotAuthorizedPage /> },

  ],
}


];

export default commonRoutes;

