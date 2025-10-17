import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Aqui entram as páginas (Home, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}
