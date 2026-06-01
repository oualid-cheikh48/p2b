import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import Footer from "../components/Footer";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  // Déclaré AVANT les useEffect qui l'utilisent
  const fetchNearbyPlaces = useCallback(async (lat, lon) => {
    setPlacesLoading(true);
    try {
      const query = `
        [out:json][timeout:10];
        (
          node["amenity"~"restaurant|cafe|bar|museum|cinema|park|supermarket|pharmacy"](around:1000,${lat},${lon});
          node["tourism"~"attraction|museum|hotel"](around:1000,${lat},${lon});
          node["leisure"~"park|garden"](around:1000,${lat},${lon});
        );
        out body 10;
      `;
      const res = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setNearbyPlaces(data.elements || []);
    } catch (err) {
      console.error("Erreur Overpass:", err);
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        const p = res.data.data || res.data;
        setProperty(p);
        if (p.latitude && p.longitude) {
          fetchNearbyPlaces(p.latitude, p.longitude);
        }
      } catch (err) {
        console.error("Erreur chargement propriété:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, fetchNearbyPlaces]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      try {
        const res = await api.get("/wishlist");
        const data = res.data.data || res.data;
        const found = Array.isArray(data) && data.some(
          (w) => w.property_id === parseInt(id) && w.user_id === user.id
        );
        setInWishlist(found);
      } catch {
        // silently fail
      }
    };
    checkWishlist();
  }, [id, user]);

  const getNights = () => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate) - new Date(startDate);
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const getTotalPrice = () => {
    const nights = getNights();
    return nights > 0 && property?.price_per_night
      ? (nights * parseFloat(property.price_per_night)).toFixed(2)
      : null;
  };

  const handleBooking = async () => {
    if (!token) { navigate("/login"); return; }
    if (!startDate || !endDate) {
      setBookingError("Veuillez sélectionner les dates d'arrivée et de départ.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setBookingError("La date de départ doit être après la date d'arrivée.");
      return;
    }
    setBookingLoading(true);
    setBookingError(null);
    try {
      await api.post("/bookings", {
        guest_id: user.id,
        property_id: parseInt(id),
        start_date: startDate,
        end_date: endDate,
        total_price: parseFloat(getTotalPrice()),
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.message || "Erreur lors de la réservation. Réessayez.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!token) { navigate("/login"); return; }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        const res = await api.get("/wishlist");
        const data = res.data.data || res.data;
        const item = Array.isArray(data) && data.find(
          (w) => w.property_id === parseInt(id) && w.user_id === user.id
        );
        if (item) await api.delete(`/wishlist/${item.id}`);
        setInWishlist(false);
      } else {
        await api.post("/wishlist", { user_id: user.id, property_id: parseInt(id) });
        setInWishlist(true);
      }
    } catch (err) {
      console.error("Erreur wishlist:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const nights = getNights();
  const totalPrice = getTotalPrice();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
          <div className="h-80 bg-white/10 rounded-2xl mb-6" />
          <div className="h-8 bg-white/10 rounded w-1/2 mb-4" />
          <div className="h-4 bg-white/10 rounded w-1/3 mb-8" />
          <div className="h-32 bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-white/50 text-xl">Logement introuvable</p>
          <Link to="/properties" className="text-violet-400 mt-4 inline-block hover:underline">
            ← Retour aux annonces
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const amenities = property.amenities || [];

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link to="/properties" className="text-white/50 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          ← Retour aux annonces
        </Link>

        {/* Galerie images */}
        <div className="mb-8">
          {images.length > 0 ? (
            <div>
              <div className="h-80 rounded-2xl overflow-hidden mb-3 relative">
                <img src={images[activeImage]?.image_url} alt={property.title} loading="lazy" className="w-full h-full object-cover" />
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-colors ${inWishlist ? "bg-red-500 text-white" : "bg-black/50 text-white/70 hover:bg-black/70"}`}
                >
                  {inWishlist ? "❤️" : "🤍"}
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? "border-violet-500" : "border-transparent"}`}>
                      <img src={img.image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-80 rounded-2xl bg-white/5 flex items-center justify-center text-6xl relative">
              🏠
              <button onClick={handleWishlist} disabled={wishlistLoading} className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-colors ${inWishlist ? "bg-red-500 text-white" : "bg-black/50 text-white/70 hover:bg-black/70"}`}>
                {inWishlist ? "❤️" : "🤍"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-violet-400 text-sm capitalize mb-2 block">{property.property_type}</span>
              <h1 className="text-3xl font-bold text-white mb-2">{property.title}</h1>
              <p className="text-white/50">📍 {property.city}, {property.country}</p>
            </div>

            <div className="flex gap-6 py-4 border-y border-white/10">
              <div className="text-center">
                <p className="text-white font-semibold">{property.max_guests}</p>
                <p className="text-white/40 text-sm">voyageurs</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">{property.bedrooms}</p>
                <p className="text-white/40 text-sm">chambre{property.bedrooms > 1 ? "s" : ""}</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">{property.bathrooms}</p>
                <p className="text-white/40 text-sm">salle{property.bathrooms > 1 ? "s" : ""} de bain</p>
              </div>
            </div>

            <div>
              <h2 className="text-white font-semibold text-lg mb-3">Description</h2>
              <p className="text-white/60 leading-relaxed">{property.description}</p>
            </div>

            {amenities.length > 0 && (
              <div>
                <h2 className="text-white font-semibold text-lg mb-3">Équipements</h2>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-sm bg-white/5 rounded-xl px-3 py-2">
                      <span className="text-violet-400">✓</span>
                      {amenity.amenity?.name || `Équipement ${amenity.amenity_id}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.owner && (
              <div>
                <h2 className="text-white font-semibold text-lg mb-3">Hôte</h2>
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-full bg-violet-600/30 flex items-center justify-center text-xl">👤</div>
                  <div>
                    <p className="text-white font-medium">{property.owner.first_name} {property.owner.last_name}</p>
                    <p className="text-white/40 text-sm">Hôte ETNAir</p>
                  </div>
                </div>
              </div>
            )}

            {/* Activités à proximité */}
            {(placesLoading || nearbyPlaces.length > 0) && (
              <div>
                <h2 className="text-white font-semibold text-lg mb-3">Activités à proximité</h2>
                {placesLoading ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {nearbyPlaces.slice(0, 8).map((place, i) => {
                      const type = place.tags?.amenity || place.tags?.tourism || place.tags?.leisure;
                      const icons = { restaurant: "🍽️", cafe: "☕", bar: "🍸", museum: "🏛️", cinema: "🎬", park: "🌳", garden: "🌿", supermarket: "🛒", pharmacy: "💊", attraction: "⭐", hotel: "🏨" };
                      const icon = icons[type] || "📍";
                      return (
                        <div key={i} className="flex items-start gap-2 bg-white/5 rounded-xl px-3 py-2 text-sm">
                          <span>{icon}</span>
                          <div className="min-w-0">
                            <p className="text-white/80 truncate">{place.tags?.name || type || "Point d'intérêt"}</p>
                            <p className="text-white/40 text-xs capitalize">{type}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Carte réservation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{property.price_per_night}€</span>
                <span className="text-white/40 text-sm"> / nuit</span>
              </div>

              {bookingSuccess ? (
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-4 py-4 text-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-semibold mb-1">Réservation confirmée !</p>
                  <p className="text-sm text-green-400/70">Retrouvez-la dans votre dashboard.</p>
                  <Link to="/dashboard/bookings" className="block mt-3 text-sm text-green-300 hover:underline">
                    Voir mes réservations →
                  </Link>
                </div>
              ) : (
                <>
                  {bookingError && (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
                      ❌ {bookingError}
                    </div>
                  )}
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1 block">Arrivée</label>
                      <input type="date" min={today} value={startDate} onChange={(e) => { setStartDate(e.target.value); setBookingError(null); }} className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500" />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1 block">Départ</label>
                      <input type="date" min={startDate || today} value={endDate} onChange={(e) => { setEndDate(e.target.value); setBookingError(null); }} className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500" />
                    </div>
                  </div>

                  {nights > 0 && totalPrice && (
                    <div className="bg-white/5 rounded-xl p-3 mb-4 space-y-2 text-sm">
                      <div className="flex justify-between text-white/50">
                        <span>{property.price_per_night}€ × {nights} nuit{nights > 1 ? "s" : ""}</span>
                        <span>{totalPrice}€</span>
                      </div>
                      <div className="flex justify-between text-white font-semibold border-t border-white/10 pt-2">
                        <span>Total</span>
                        <span>{totalPrice}€</span>
                      </div>
                    </div>
                  )}

                  <button onClick={handleBooking} disabled={bookingLoading} className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors">
                    {bookingLoading ? "Réservation en cours..." : token ? "Réserver" : "Se connecter pour réserver"}
                  </button>
                  <p className="text-white/30 text-xs text-center mt-3">Vous ne serez pas débité maintenant</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetails;