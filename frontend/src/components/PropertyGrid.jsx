import PropertyCard from "./PropertyCard";
import useThemeStore from "../store/themeStore";

const PropertyGrid = ({ properties, loading }) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={
              isDark
                ? "rounded-2xl overflow-hidden bg-white/5 border border-white/10 animate-pulse"
                : "rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm animate-pulse"
            }
          >
            <div className={isDark ? "h-52 bg-white/10" : "h-52 bg-gray-100"} />
            <div className="p-4 space-y-3">
              <div className={isDark ? "h-4 bg-white/10 rounded w-3/4" : "h-4 bg-gray-200 rounded w-3/4"} />
              <div className={isDark ? "h-3 bg-white/10 rounded w-1/2" : "h-3 bg-gray-200 rounded w-1/2"} />
              <div className={isDark ? "h-3 bg-white/10 rounded w-1/3" : "h-3 bg-gray-200 rounded w-1/3"} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className={isDark ? "text-white/30 text-xl mb-2" : "text-gray-300 text-xl mb-2"}>🏠</p>
        <p className={isDark ? "text-white/50 text-lg" : "text-gray-700 text-lg font-medium"}>Aucun logement trouvé</p>
        <p className={isDark ? "text-white/30 text-sm mt-1" : "text-gray-500 text-sm mt-1"}>
          Essayez de modifier vos filtres
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;