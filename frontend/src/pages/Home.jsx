import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import api from "../api/axios";
import ScrollToTop from "../components/ScrollToTop";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/properties");
        const data = res.data.data || res.data;
        setFeaturedProperties(data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?city=${query}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero avec image de fond */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
            Trouvez votre logement idéal
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-10 drop-shadow">
            Des milliers de logements uniques partout en France
          </p>

          <form
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur border border-white/20 rounded-full flex items-center overflow-hidden max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center px-6 py-4 gap-3">
              <span className="text-white/40">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une ville..."
                className="flex-1 text-white placeholder-white/40 outline-none text-base bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-4 font-semibold transition-colors rounded-full m-1.5"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white/3 py-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
          {[
            { value: "500+", label: "Logements disponibles" },
            { value: "50+", label: "Villes en France" },
            { value: "1000+", label: "Voyageurs satisfaits" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-white/40 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logements populaires */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Logements populaires</h2>
          <button
            onClick={() => navigate("/properties")}
            className="text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors"
          >
            Voir tout →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
      </section>

      {/* Destinations populaires */}
      <section className="bg-white/3 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Destinations populaires
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: "Paris", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" },
              { city: "Lyon", img: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400" },
              { city: "Nice", img: "https://images.unsplash.com/photo-1491166617655-0723a0567989?w=400" },
              { city: "Bordeaux", img: "https://images.unsplash.com/photo-1589535015258-37e853361e8e?w=400" },
            ].map((dest, i) => (
              <button
                key={i}
                onClick={() => navigate(`/properties?city=${dest.city}`)}
                className="relative h-40 md:h-52 rounded-2xl overflow-hidden group"
              >
                <img
                  src={dest.img}
                  alt={dest.city}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <p className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow">
                  {dest.city}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi nous */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Pourquoi choisir p2b ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🏠", title: "Logements vérifiés", desc: "Chaque logement est inspecté et approuvé par notre équipe avant publication." },
            { icon: "🔒", title: "Paiement sécurisé", desc: "Vos transactions sont protégées et sécurisées à chaque étape." },
            { icon: "💬", title: "Support 24/7", desc: "Notre équipe est disponible à toute heure pour vous accompagner." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA hôte */}
      <section className="bg-violet-600/10 border-t border-violet-500/20 py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Vous avez un logement à louer ?
            </h2>
            <p className="text-white/40">
              Rejoignez des milliers d'hôtes et commencez à gagner de l'argent.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/create")}
            className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors whitespace-nowrap flex-shrink-0"
          >
            Publier une annonce
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;