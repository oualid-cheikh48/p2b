import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";
import api from "../../api/axios";
import Toast from "../../components/Toast";

const Wishlist = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/wishlist");
        const data = res.data.data || res.data;
        const myWishlist = Array.isArray(data)
          ? data.filter((w) => w.user_id === user?.id)
          : [];
        setWishlist(myWishlist);
      } catch (err) {
        console.error("Erreur chargement wishlist:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchWishlist();
  }, [user]);

  const handleRemove = async (wishlistId, propertyId) => {
    try {
      await api.delete(`/wishlist/${wishlistId}`);
      setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
    } catch (err) {
      try {
        await api.delete(`/wishlist/${propertyId}`);
        setWishlist((prev) => prev.filter((w) => w.property_id !== propertyId));
      } catch {
        setToast({ message: "Impossible de retirer de la wishlist.", type: "error" });
      }
    }
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className={isDark ? "text-3xl font-bold text-white mb-1" : "text-3xl font-bold text-slate-900 mb-1"}>
            Ma Wishlist
          </h1>
          <p className={isDark ? "text-white/40" : "text-gray-500"}>
            {loading
              ? "Chargement..."
              : `${wishlist.length} logement${wishlist.length > 1 ? "s" : ""} sauvegardé${wishlist.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={
                  isDark
                    ? "bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                    : "bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-pulse"
                }
              >
                <div className={isDark ? "h-40 bg-white/10" : "h-40 bg-gray-100"} />
                <div className="p-4 space-y-3">
                  <div className={isDark ? "h-4 bg-white/10 rounded w-3/4" : "h-4 bg-gray-200 rounded w-3/4"} />
                  <div className={isDark ? "h-3 bg-white/10 rounded w-1/2" : "h-3 bg-gray-200 rounded w-1/2"} />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div
            className={
              isDark
                ? "text-center py-20 bg-white/5 border border-white/10 rounded-2xl"
                : "text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm"
            }
          >
            <p className="text-4xl mb-4">❤️</p>
            <p className={isDark ? "text-white/50 text-lg mb-2" : "text-gray-800 text-lg font-medium mb-2"}>Votre wishlist est vide</p>
            <p className={isDark ? "text-white/30 text-sm mb-6" : "text-gray-500 text-sm mb-6"}>
              Ajoutez des logements à vos favoris pour les retrouver ici.
            </p>
            <Link
              to="/properties"
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-block"
            >
              Explorer les logements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map((item) => {
              const property = item.property;
              const mainImage =
                property?.images?.find((img) => img.is_main)?.image_url ||
                property?.images?.[0]?.image_url ||
                null;

              return (
                <div
                  key={item.id}
                  className={
                    isDark
                      ? "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-colors group"
                      : "bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-violet-300 transition-colors group"
                  }
                >
                  <div className={isDark ? "relative h-40 bg-white/5 overflow-hidden" : "relative h-40 bg-gray-100 overflow-hidden"}>
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={property?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={isDark ? "w-full h-full flex items-center justify-center text-4xl text-white/20" : "w-full h-full flex items-center justify-center text-4xl text-gray-300"}>
                        🏠
                      </div>
                    )}
                    <button
                      onClick={() => handleRemove(item.id, item.property_id)}
                      className="absolute top-3 right-3 bg-black/50 backdrop-blur hover:bg-red-500/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm"
                      title="Retirer de la wishlist"
                    >
                      ❤️
                    </button>
                    {property?.price_per_night && (
                      <span className="absolute bottom-3 right-3 bg-violet-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        {property.price_per_night}€ / nuit
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className={isDark ? "text-white font-semibold mb-1 truncate" : "text-gray-900 font-semibold mb-1 truncate"}>
                      {property?.title || `Logement #${item.property_id}`}
                    </h3>
                    {property?.city && (
                      <p className={isDark ? "text-white/40 text-sm mb-3" : "text-gray-500 text-sm mb-3"}>
                        📍 {property.city}, {property.country}
                      </p>
                    )}
                    {property?.id && (
                      <Link
                        to={`/properties/${property.id}`}
                        className={
                          isDark
                            ? "block w-full text-center bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 py-2 rounded-xl text-sm font-medium transition-colors"
                            : "block w-full text-center bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 py-2 rounded-xl text-sm font-medium transition-colors"
                        }
                      >
                        Voir le logement →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Wishlist;