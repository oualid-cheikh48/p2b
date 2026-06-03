import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";

const links = [
  { path: "/dashboard/profile", label: "Mon Profil", icon: "👤" },
  { path: "/dashboard/bookings", label: "Mes Réservations", icon: "📅" },
  { path: "/dashboard/properties", label: "Mes Annonces", icon: "🏠" },
  { path: "/dashboard/host-bookings", label: "Réservations reçues", icon: "📋" },
  { path: "/dashboard/wishlist", label: "Wishlist", icon: "❤️" },
  { path: "/dashboard/create", label: "Créer une annonce", icon: "➕" },
];

const DashboardSidebar = ({ onClose }) => {
  const { logout, user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={
        isDark
          ? "w-64 h-full min-h-screen bg-gray-950 border-r border-white/10 flex flex-col p-6"
          : "w-64 h-full min-h-screen bg-[#ffffff] border-r border-gray-200 flex flex-col p-6 shadow-sm"
      }
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className={isDark ? "text-white/40 text-xs uppercase tracking-widest mb-1" : "text-gray-500 text-xs uppercase tracking-widest mb-1"}>
            Connecté en tant que
          </p>
          <p className={isDark ? "text-white font-semibold truncate text-sm" : "text-gray-900 font-semibold truncate text-sm"}>
            {user?.email || "Utilisateur"}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={isDark ? "lg:hidden text-white/40 hover:text-white p-1 transition-colors" : "lg:hidden text-gray-400 hover:text-gray-900 p-1 transition-colors"}
          >
            ✕
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition font-medium ${
                isActive
                  ? "bg-violet-600 text-white shadow-sm"
                  : isDark
                    ? "text-white/60 hover:bg-white/10 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className={
          isDark
            ? "mt-6 text-red-400 hover:text-red-300 text-sm font-medium transition text-left px-4"
            : "mt-6 text-red-500 hover:text-red-600 text-sm font-medium transition text-left px-4"
        }
      >
        🚪 Se déconnecter
      </button>
    </aside>
  );
};

export default DashboardSidebar;