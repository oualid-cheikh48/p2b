import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
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
      <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 bg-white/5 overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">
              🏠
            </div>
          )}
          {/* Badge type */}
          <span className="absolute top-3 left-3 bg-black/50 backdrop-blur text-white/80 text-xs px-2 py-1 rounded-full capitalize">
            {property_type || "logement"}
          </span>
          {/* Prix */}
          <span className="absolute bottom-3 right-3 bg-violet-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
            {price_per_night}€ / nuit
          </span>
        </div>

        {/* Infos */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-base truncate mb-1 group-hover:text-violet-300 transition-colors">
            {title}
          </h3>
          <p className="text-white/50 text-sm mb-3">
            📍 {city}, {country}
          </p>
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span>🛏 {bedrooms} chambre{bedrooms > 1 ? "s" : ""}</span>
            <span>👥 {max_guests} voyageur{max_guests > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
