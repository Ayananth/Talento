import { RouterProvider } from "react-router-dom";
import router from './app/routes/router'
import { AuthProvider } from "./auth/context/AuthContext";

export default function App() {
  return(
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>

  ) 
}
