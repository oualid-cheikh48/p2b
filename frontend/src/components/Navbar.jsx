import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="w-full px-4 md:px-8 py-4 bg-white/5 backdrop-blur border-b border-white/10 relative z-10">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-white font-bold text-xl tracking-tight">
          P2B
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">
            Accueil
          </Link>
          <Link to="/properties" className="text-white/60 hover:text-white text-sm transition-colors">
            Logements
          </Link>
          <Link to="/contact" className="text-white/60 hover:text-white text-sm transition-colors">
            Contact
          </Link>
        </div>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white/60 text-sm">
                Bonjour, {user.first_name || user.email}
              </span>
              <Link to="/dashboard/profile" className="text-white/80 hover:text-white text-sm transition">
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
              <Link to="/login" className="text-white/80 hover:text-white text-sm transition">
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
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 flex flex-col gap-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-white/60 hover:text-white text-sm transition-colors py-2"
          >
            Accueil
          </Link>
          <Link
            to="/properties"
            onClick={() => setMenuOpen(false)}
            className="text-white/60 hover:text-white text-sm transition-colors py-2"
          >
            Logements
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-white/60 hover:text-white text-sm transition-colors py-2"
          >
            Contact
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard/profile"
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white text-sm transition py-2"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm transition text-left"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white text-sm transition py-2"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm transition text-center"
              >
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