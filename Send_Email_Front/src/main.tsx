import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";

const router = createBrowserRouter([
  // pública
  { path: "/login", element: <Login /> },

  // protegida: layout App + páginas filhas
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <App />, // layout com Navbar + <Outlet />
        children: [
          { path: "/", element: <Home /> },
          // futuras rotas protegidas:
          // { path: "/emails", element: <Emails /> },
          // { path: "/settings", element: <Settings /> },
        ],
      },
    ],
  },

  // fallback
  { path: "*", element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
