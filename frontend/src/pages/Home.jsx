import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import api from "../api/axios";

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/properties");
        const data = res.data.data || res.data;
        setFeaturedProperties(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (query) => {
    navigate(`/properties?city=${query}`);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center py-24 px-4 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-violet-600/20 text-violet-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-violet-500/30">
            ✈️ La plateforme de location moderne
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Trouvez votre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              logement idéal
            </span>
          </h1>

          <p className="text-white/50 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Des milliers de logements uniques vous attendent. Studios, appartements, villas — trouvez l'endroit parfait pour votre prochain séjour.
          </p>

          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-center gap-0 border border-white/10 rounded-2xl overflow-hidden">
          {[
            { value: "500+", label: "Logements" },
            { value: "50+", label: "Villes" },
            { value: "1000+", label: "Voyageurs" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`flex-1 text-center py-6 ${
                i < 2 ? "border-r border-white/10" : ""
              }`}
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/40 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Logements populaires */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Logements populaires</h2>
          <button
            onClick={() => navigate("/properties")}
            className="text-violet-400 hover:text-violet-300 text-sm transition-colors"
          >
            Voir tout →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 animate-pulse">
                <div className="h-52 bg-white/10" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6">Pourquoi choisir P2B ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🏙️", title: "Villes populaires", desc: "Paris, Lyon, Nice, Bordeaux et plus encore" },
            { icon: "💎", title: "Qualité garantie", desc: "Tous nos logements sont vérifiés et approuvés" },
            { icon: "🔒", title: "Réservation sécurisée", desc: "Paiements protégés et assistance 24/7" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors"
            >
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
