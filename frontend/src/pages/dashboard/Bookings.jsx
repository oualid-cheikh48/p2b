import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";
import api from "../../api/axios";
import Toast from "../../components/Toast";

const getStatusConfig = (isDark) => ({
  pending: {
    label: "En attente",
    color: isDark
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "Confirmée",
    color: isDark
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-green-50 text-green-700 border-green-200",
  },
  completed: {
    label: "Terminée",
    color: isDark
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : "bg-blue-50 text-blue-700 border-blue-200",
  },
  cancelled: {
    label: "Annulée",
    color: isDark
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : "bg-red-50 text-red-700 border-red-200",
  },
});

const Bookings = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const statusConfig = getStatusConfig(isDark);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        const data = res.data.data || res.data;
        const myBookings = Array.isArray(data)
          ? data.filter((b) => b.guest_id === user?.id)
          : [];
        setBookings(myBookings);
      } catch (err) {
        console.error("Erreur chargement réservations:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchBookings();
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm("Voulez-vous vraiment annuler cette réservation ?")) return;
    try {
      await api.put(`/bookings/${id}`, { booking_status: "cancelled" });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, booking_status: "cancelled" } : b))
      );
    } catch (err) {
      setToast({ message: "Impossible d'annuler la réservation.", type: "error" });
    }
  };

  const tabs = [
    { key: "all", label: "Toutes" },
    { key: "pending", label: "En attente" },
    { key: "confirmed", label: "Confirmées" },
    { key: "completed", label: "Terminées" },
    { key: "cancelled", label: "Annulées" },
  ];

  const filtered =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.booking_status === activeTab);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getNights = (start, end) => {
    if (!start || !end) return 0;
    const diff = new Date(end) - new Date(start);
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className={isDark ? "text-3xl font-bold text-white mb-1" : "text-3xl font-bold text-slate-900 mb-1"}>
            Mes Réservations
          </h1>
          <p className={isDark ? "text-white/40" : "text-gray-500"}>
            {loading
              ? "Chargement..."
              : `${bookings.length} réservation${bookings.length > 1 ? "s" : ""} au total`}
          </p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${
                activeTab === tab.key
                  ? "bg-violet-600 text-white border-violet-600"
                  : isDark
                    ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border-white/10"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-gray-200 shadow-sm"
              }`}
            >
              {tab.label}
              {tab.key !== "all" && (
                <span className="ml-2 text-xs opacity-60">
                  {bookings.filter((b) => b.booking_status === tab.key).length}
                </span>
              )}
            </button>
          ))}
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
                <div className="flex gap-4">
                  <div className={isDark ? "w-24 h-20 bg-white/10 rounded-xl flex-shrink-0" : "w-24 h-20 bg-gray-100 rounded-xl flex-shrink-0"} />
                  <div className="flex-1 space-y-3">
                    <div className={isDark ? "h-5 bg-white/10 rounded w-1/2" : "h-5 bg-gray-200 rounded w-1/2"} />
                    <div className={isDark ? "h-4 bg-white/10 rounded w-1/3" : "h-4 bg-gray-200 rounded w-1/3"} />
                    <div className={isDark ? "h-4 bg-white/10 rounded w-1/4" : "h-4 bg-gray-200 rounded w-1/4"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className={
              isDark
                ? "text-center py-20 bg-white/5 border border-white/10 rounded-2xl"
                : "text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm"
            }
          >
            <p className="text-4xl mb-4">📅</p>
            <p className={isDark ? "text-white/50 text-lg mb-2" : "text-gray-800 text-lg font-medium mb-2"}>Aucune réservation</p>
            <p className={isDark ? "text-white/30 text-sm" : "text-gray-500 text-sm"}>
              {activeTab === "all"
                ? "Vous n'avez pas encore effectué de réservation."
                : `Aucune réservation avec le statut "${tabs.find((t) => t.key === activeTab)?.label}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const status = statusConfig[booking.booking_status] || statusConfig.pending;
              const nights = getNights(booking.start_date, booking.end_date);
              const property = booking.property;

              return (
                <div
                  key={booking.id}
                  className={
                    isDark
                      ? "bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/20 transition-colors"
                      : "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-violet-300 transition-colors"
                  }
                >
                  <div className="flex gap-4 items-start">
                    <div className={isDark ? "w-24 h-20 rounded-xl bg-white/10 flex-shrink-0 overflow-hidden" : "w-24 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden"}>
                      {property?.images?.[0]?.image_url ? (
                        <img
                          src={property.images[0].image_url}
                          alt={property?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={isDark ? "w-full h-full flex items-center justify-center text-2xl text-white/20" : "w-full h-full flex items-center justify-center text-2xl text-gray-300"}>
                          🏠
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className={isDark ? "text-white font-semibold text-base truncate" : "text-gray-900 font-semibold text-base truncate"}>
                            {property?.title || `Réservation #${booking.id}`}
                          </h3>
                          {property?.city && (
                            <p className={isDark ? "text-white/40 text-sm" : "text-gray-500 text-sm"}>
                              📍 {property.city}, {property.country}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full border flex-shrink-0 ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className={isDark ? "flex flex-wrap gap-4 text-sm text-white/50 mb-4" : "flex flex-wrap gap-4 text-sm text-gray-500 mb-4"}>
                        <span>
                          📅 {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                        </span>
                        <span>🌙 {nights} nuit{nights > 1 ? "s" : ""}</span>
                        <span className={isDark ? "text-violet-400 font-semibold" : "text-violet-600 font-semibold"}>
                          💶 {booking.total_price}€
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {property?.id && (
                          <a
                            href={`/properties/${property.id}`}
                            className={
                              isDark
                                ? "bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-lg text-sm transition-colors"
                            }
                          >
                            Voir l'annonce
                          </a>
                        )}
                        {(booking.booking_status === "pending" || booking.booking_status === "confirmed") && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className={
                              isDark
                                ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-1.5 rounded-lg text-sm transition-colors"
                                : "bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-sm transition-colors border border-red-200"
                            }
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
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

export default Bookings;