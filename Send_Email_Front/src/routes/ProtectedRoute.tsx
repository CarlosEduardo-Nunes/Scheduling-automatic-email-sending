import { Navigate, Outlet, useLocation } from "react-router-dom";
import { readToken } from "../lib/storage";

/**
 * Protege rotas que exigem autenticação.
 * Uso:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const token = readToken();

  if (!token) {
    // Redireciona para /login e guarda de onde veio para pós-login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Libera acesso às rotas filhas
  return <Outlet />;
}
