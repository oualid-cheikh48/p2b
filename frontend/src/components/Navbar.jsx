import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between bg-white/5 backdrop-blur border-b border-white/10">
      <Link to="/" className="text-white font-bold text-xl tracking-tight">
        P2B
      </Link>

      {/* Liens navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          to="/"
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          Accueil
        </Link>
        <Link
          to="/properties"
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          Logements
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-white/60 text-sm hidden md:block">
              Bonjour, {user.first_name || user.email}
            </span>
            <Link
              to="/dashboard/profile"
              className="text-white/80 hover:text-white text-sm transition"
            >
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
            <Link
              to="/login"
              className="text-white/80 hover:text-white text-sm transition"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
