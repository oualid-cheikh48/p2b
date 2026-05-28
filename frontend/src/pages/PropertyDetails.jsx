import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data.data || res.data);
      } catch (err) {
        console.error("Erreur chargement propriété:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

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
        {/* Retour */}
        <Link
          to="/properties"
          className="text-white/50 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          ← Retour aux annonces
        </Link>

        {/* Galerie images */}
        <div className="mb-8">
          {images.length > 0 ? (
            <div>
              <div className="h-80 rounded-2xl overflow-hidden mb-3">
                <img
                  src={images[activeImage]?.image_url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                        activeImage === i ? "border-violet-500" : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-80 rounded-2xl bg-white/5 flex items-center justify-center text-6xl">
              🏠
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Infos principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre */}
            <div>
              <span className="text-violet-400 text-sm capitalize mb-2 block">
                {property.property_type}
              </span>
              <h1 className="text-3xl font-bold text-white mb-2">
                {property.title}
              </h1>
              <p className="text-white/50">
                📍 {property.city}, {property.country}
              </p>
            </div>

            {/* Stats */}
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

            {/* Description */}
            <div>
              <h2 className="text-white font-semibold text-lg mb-3">
                Description
              </h2>
              <p className="text-white/60 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Équipements */}
            {amenities.length > 0 && (
              <div>
                <h2 className="text-white font-semibold text-lg mb-3">
                  Équipements
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-white/60 text-sm bg-white/5 rounded-xl px-3 py-2"
                    >
                      <span className="text-violet-400">✓</span>
                      {amenity.amenity?.name || `Équipement ${amenity.amenity_id}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hôte */}
            {property.owner && (
              <div>
                <h2 className="text-white font-semibold text-lg mb-3">Hôte</h2>
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-full bg-violet-600/30 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {property.owner.first_name} {property.owner.last_name}
                    </p>
                    <p className="text-white/40 text-sm">Hôte P2B</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Carte réservation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">
                  {property.price_per_night}€
                </span>
                <span className="text-white/40 text-sm"> / nuit</span>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-white/60 text-sm mb-1 block">
                    Arrivée
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1 block">
                    Départ
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold transition-colors">
                Réserver
              </button>

              <p className="text-white/30 text-xs text-center mt-3">
                Vous ne serez pas débité maintenant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
