import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootRedirect } from "./components/RootRedirect";

const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/dashboard", element: <DashboardPage /> }],
  },
]);

export default router;
