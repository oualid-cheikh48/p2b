import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PropertyGrid from "../components/PropertyGrid";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import api from "../api/axios";
import ScrollToTop from "../components/ScrollToTop";
import Footer from "../components/Footer";
import useThemeStore from "../store/themeStore";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 9;

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    property_type: "",
    min_price: "",
    max_price: "",
    guests: "",
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append("city", filters.city);
      if (filters.property_type) params.append("property_type", filters.property_type);
      if (filters.min_price) params.append("min_price", filters.min_price);
      if (filters.max_price) params.append("max_price", filters.max_price);
      if (filters.guests) params.append("guests", filters.guests);
      params.append("page", page);
      params.append("limit", limit);

      const res = await api.get(`/properties?${params.toString()}`);
      const data = res.data.data || res.data.properties || res.data;
      setProperties(Array.isArray(data) ? data : []);
      setTotal(res.data.total || data.length);
    } catch (err) {
      console.error("Erreur chargement propriétés:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, city: query }));
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={isDark ? "min-h-screen bg-[#050816] text-white" : "min-h-screen bg-[#f8f8fb] text-gray-900"}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className={isDark ? "text-3xl font-bold text-white mb-2" : "text-3xl font-bold text-slate-900 mb-2"}>
            Tous les logements
          </h1>
          <p className={isDark ? "text-white/40" : "text-gray-500"}>
            {loading ? "Chargement..." : `${total} logement${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex gap-8 items-start">
          <div className="hidden lg:block w-72 flex-shrink-0 sticky top-6">
            <FilterSidebar filters={filters} onChange={handleFilterChange} />
          </div>

          <div className="flex-1">
            <PropertyGrid properties={properties} loading={loading} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={
                    isDark
                      ? "px-4 py-2 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                      : "px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                  }
                >
                  ← Précédent
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      page === i + 1
                        ? "bg-violet-600 text-white"
                        : isDark
                          ? "bg-white/10 text-white/60 hover:bg-white/20"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={
                    isDark
                      ? "px-4 py-2 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                      : "px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                  }
                >
                  Suivant →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Properties;