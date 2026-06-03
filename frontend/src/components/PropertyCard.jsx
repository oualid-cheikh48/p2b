import { Link } from "react-router-dom";
import useThemeStore from "../store/themeStore";

const PropertyCard = ({ property }) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const {
    id,
    title,
    city,
    country,
    price_per_night,
    property_type,
    max_guests,
    bedrooms,
    images,
  } = property;

  const mainImage =
    images?.find((img) => img.is_main)?.image_url ||
    images?.[0]?.image_url ||
    null;

  return (
    <Link to={`/properties/${id}`} className="group block">
      <div
        className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
          isDark
            ? "bg-white/5 border-white/10 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10"
            : "bg-white border-gray-200 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-200"
        }`}
      >
        <div
          className={`relative h-52 overflow-hidden ${
            isDark ? "bg-white/5" : "bg-gray-100"
          }`}
        >
          {mainImage ? (
            <img
              src={mainImage}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-4xl ${
                isDark ? "text-white/20" : "text-gray-300"
              }`}
            >
              🏠
            </div>
          )}

          <span className="absolute top-3 left-3 bg-black/50 backdrop-blur text-white/80 text-xs px-2 py-1 rounded-full capitalize">
            {property_type || "logement"}
          </span>

          <span className="absolute bottom-3 right-3 bg-violet-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
            {price_per_night}€ / nuit
          </span>
        </div>

        <div className="p-4">
          <h3
            className={`font-semibold text-base truncate mb-1 transition-colors group-hover:text-violet-500 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>

          <p className={`text-sm mb-3 ${isDark ? "text-white/50" : "text-gray-500"}`}>
            📍 {city}, {country}
          </p>

          <div
            className={`flex items-center gap-3 text-xs ${
              isDark ? "text-white/40" : "text-gray-400"
            }`}
          >
            <span>🛏 {bedrooms} chambre{bedrooms > 1 ? "s" : ""}</span>
            <span>👥 {max_guests} voyageur{max_guests > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;