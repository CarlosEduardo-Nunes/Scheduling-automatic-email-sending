import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();            // limpa token no contexto + localStorage
    navigate("/login");  // manda pra tela de login
  }

  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={isAuthenticated ? "/" : "/login"} className="font-semibold">
          Send Email
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/" className="hover:underline">
                Início
              </Link>
              {/* futuras páginas protegidas:
              <Link to="/emails" className="hover:underline">Emails</Link>
              <Link to="/settings" className="hover:underline">Configurações</Link>
              */}
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition"
                aria-label="Sair"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
