import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";
import api from "../../api/axios";
import Toast from "../../components/Toast";

const MyProperties = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchMyProperties = async () => {
    try {
      const res = await api.get(`/properties?owner_id=${user.id}`);
      const data = res.data.data || res.data;
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyProperties();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      setToast({ message: "Erreur lors de la suppression.", type: "error" });
    }
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className={isDark ? "text-3xl font-bold text-white mb-1" : "text-3xl font-bold text-slate-900 mb-1"}>
              Mes Annonces
            </h1>
            <p className={isDark ? "text-white/40" : "text-gray-500"}>
              {loading ? "Chargement..." : `${properties.length} annonce${properties.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/create")}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            ➕ Nouvelle annonce
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={
                  isDark
                    ? "bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse"
                    : "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse"
                }
              >
                <div className={isDark ? "h-5 bg-white/10 rounded w-1/2 mb-3" : "h-5 bg-gray-200 rounded w-1/2 mb-3"} />
                <div className={isDark ? "h-4 bg-white/10 rounded w-1/3" : "h-4 bg-gray-200 rounded w-1/3"} />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div
            className={
              isDark
                ? "text-center py-20 bg-white/5 border border-white/10 rounded-2xl"
                : "text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm"
            }
          >
            <p className="text-4xl mb-4">🏠</p>
            <p className={isDark ? "text-white/50 text-lg mb-2" : "text-gray-800 text-lg font-medium mb-2"}>Aucune annonce pour le moment</p>
            <p className={isDark ? "text-white/30 text-sm mb-6" : "text-gray-500 text-sm mb-6"}>Publiez votre premier logement sur p2b</p>
            <button
              onClick={() => navigate("/dashboard/create")}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Créer une annonce
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className={
                  isDark
                    ? "bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors"
                    : "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-violet-300 transition-colors"
                }
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className={isDark ? "text-white font-semibold text-lg" : "text-gray-900 font-semibold text-lg"}>
                        {property.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          property.status === "active"
                            ? isDark
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-green-50 text-green-700 border-green-200"
                            : isDark
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {property.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    <p className={isDark ? "text-white/40 text-sm mb-3" : "text-gray-500 text-sm mb-3"}>
                      📍 {property.city}, {property.country}
                    </p>
                    <div className={isDark ? "flex flex-wrap items-center gap-4 text-white/40 text-sm" : "flex flex-wrap items-center gap-4 text-gray-500 text-sm"}>
                      <span>💰 {property.price_per_night}€ / nuit</span>
                      <span>👥 {property.max_guests} voyageurs</span>
                      <span>🛏 {property.bedrooms} chambre{property.bedrooms > 1 ? "s" : ""}</span>
                      <span className="capitalize">🏠 {property.property_type}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className={
                        isDark
                          ? "bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-sm transition-colors"
                      }
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/properties/${property.id}/edit`)}
                      className={
                        isDark
                          ? "bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 px-4 py-2 rounded-xl text-sm transition-colors"
                          : "bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 px-4 py-2 rounded-xl text-sm transition-colors"
                      }
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className={
                        isDark
                          ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm transition-colors"
                          : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-sm transition-colors"
                      }
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProperties;