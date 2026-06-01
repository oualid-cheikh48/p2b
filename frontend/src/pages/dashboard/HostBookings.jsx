import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import useAuthStore from "../../store/authStore";
import api from "../../api/axios";
import Toast from "../../components/Toast";

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmed: { label: "Confirmée", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  completed: { label: "Terminée", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  cancelled: { label: "Annulée", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const HostBookings = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Récupère toutes les propriétés de l'hôte
        const propsRes = await api.get(`/properties?owner_id=${user?.id}`);
        const props = propsRes.data.data || propsRes.data;
        const propertyIds = Array.isArray(props) ? props.map((p) => p.id) : [];

        // Récupère toutes les réservations
        const bookingsRes = await api.get("/bookings");
        const allBookings = bookingsRes.data.data || bookingsRes.data;

        // Filtre les réservations sur les propriétés de l'hôte
        const hostBookings = Array.isArray(allBookings)
          ? allBookings.filter((b) => propertyIds.includes(b.property_id))
          : [];

        setBookings(hostBookings);
      } catch (err) {
        console.error("Erreur chargement réservations:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchBookings();
  }, [user]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { booking_status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, booking_status: newStatus } : b))
      );
      setToast({
        message: newStatus === "confirmed" ? "Réservation confirmée !" : "Réservation refusée.",
        type: newStatus === "confirmed" ? "success" : "error",
      });
    } catch (err) {
      setToast({ message: "Erreur lors de la mise à jour.", type: "error" });
    }
  };

  const tabs = [
    { key: "pending", label: "En attente" },
    { key: "confirmed", label: "Confirmées" },
    { key: "completed", label: "Terminées" },
    { key: "cancelled", label: "Annulées" },
    { key: "all", label: "Toutes" },
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
    return Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
  };

  return (
    <DashboardLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Réservations reçues</h1>
          <p className="text-white/40">
            {loading ? "Chargement..." : `${bookings.length} réservation${bookings.length > 1 ? "s" : ""} au total`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
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
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-white/10 rounded w-1/2 mb-3" />
                <div className="h-4 bg-white/10 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-white/50 text-lg mb-2">Aucune réservation</p>
            <p className="text-white/30 text-sm">
              {activeTab === "pending"
                ? "Aucune demande en attente pour le moment."
                : "Aucune réservation dans cette catégorie."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const status = statusConfig[booking.booking_status] || statusConfig.pending;
              const nights = getNights(booking.start_date, booking.end_date);
              const property = booking.property;
              const guest = booking.guest;

              return (
                <div
                  key={booking.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-semibold">
                          {property?.title || `Réservation #${booking.id}`}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-white/40 text-sm">
                        👤 {guest?.first_name} {guest?.last_name} — {guest?.email}
                      </p>
                    </div>
                    <p className="text-violet-400 font-bold text-lg flex-shrink-0">
                      {booking.total_price}€
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-4">
                    <span>📅 {formatDate(booking.start_date)} → {formatDate(booking.end_date)}</span>
                    <span>🌙 {nights} nuit{nights > 1 ? "s" : ""}</span>
                  </div>

                  {/* Actions uniquement pour pending */}
                  {booking.booking_status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        ✓ Confirmer
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        ✕ Refuser
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HostBookings;