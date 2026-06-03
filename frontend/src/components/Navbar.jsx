import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === "dark";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className={`w-full px-4 md:px-8 py-4 backdrop-blur border-b relative z-10 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className={`font-bold text-xl tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
          P2B
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm transition-colors ${isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            Accueil
          </Link>
          <Link to="/properties" className={`text-sm transition-colors ${isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            Logements
          </Link>
          <Link to="/contact" className={`text-sm transition-colors ${isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            Contact
          </Link>
        </div>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleTheme} className={`transition text-xl ${isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            {isDark ? "☀️" : "🌙"}
          </button>
          {user ? (
            <>
              <span className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
                Bonjour, {user.first_name || user.email}
              </span>
              <Link to="/dashboard/profile" className={`text-sm transition ${isDark ? "text-white/80 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`text-sm transition ${isDark ? "text-white/80 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>
                Connexion
              </Link>
              <Link to="/register" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm transition">
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Bouton hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className={`md:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-3 ${isDark ? "border-white/10" : "border-gray-200"}`}>
          <Link to="/" onClick={() => setMenuOpen(false)} className={`text-sm transition-colors py-2 ${isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            Accueil
          </Link>
          <Link to="/properties" onClick={() => setMenuOpen(false)} className={`text-sm transition-colors py-2 ${isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            Logements
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className={`text-sm transition-colors py-2 ${isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            Contact
          </Link>
          <button onClick={toggleTheme} className={`transition text-xl py-2 text-left ${isDark ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
            {isDark ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
          {user ? (
            <>
              <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)} className={`text-sm transition py-2 ${isDark ? "text-white/80 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm transition text-left">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className={`text-sm transition py-2 ${isDark ? "text-white/80 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>
                Connexion
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm transition text-center">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
