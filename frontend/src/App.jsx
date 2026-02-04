import { RouterProvider } from "react-router-dom";
import router from './app/routes/router'
import { AuthProvider } from "./auth/context/AuthContext";
import { UnreadProvider } from "./context/UnreadContext";

export default function App() {
  return(
<AuthProvider>
  <UnreadProvider>
  <RouterProvider router={router} />
  </UnreadProvider>
</AuthProvider>

  ) 
}
