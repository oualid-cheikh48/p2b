import useThemeStore from "../store/themeStore";

const FilterSidebar = ({ filters, onChange }) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const propertyTypes = ["apartment", "house", "villa", "studio"];

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onChange({
      city: "",
      property_type: "",
      min_price: "",
      max_price: "",
      guests: "",
    });
  };

  return (
    <div
      className={
        isDark
          ? "bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
          : "bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm"
      }
    >
      <div className="flex items-center justify-between">
        <h3 className={isDark ? "text-white font-semibold" : "text-gray-900 font-semibold"}>Filtres</h3>
        <button
          onClick={handleReset}
          className={
            isDark
              ? "text-white/40 hover:text-white/70 text-sm transition-colors"
              : "text-gray-500 hover:text-gray-700 text-sm transition-colors"
          }
        >
          Réinitialiser
        </button>
      </div>

      <div>
        <label className={isDark ? "text-white/60 text-sm mb-2 block" : "text-gray-600 text-sm mb-2 block"}>Ville</label>
        <input
          type="text"
          value={filters.city || ""}
          onChange={(e) => handleChange("city", e.target.value)}
          placeholder="Paris, Lyon..."
          className={
            isDark
              ? "w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              : "w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
          }
        />
      </div>

      <div>
        <label className={isDark ? "text-white/60 text-sm mb-2 block" : "text-gray-600 text-sm mb-2 block"}>Type</label>
        <select
          value={filters.property_type || ""}
          onChange={(e) => handleChange("property_type", e.target.value)}
          className={
            isDark
              ? "w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              : "w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
          }
        >
          <option value="">Tous les types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type} className={isDark ? "bg-gray-900" : "bg-white text-gray-900"}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={isDark ? "text-white/60 text-sm mb-2 block" : "text-gray-600 text-sm mb-2 block"}>
          Prix par nuit (€)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.min_price || ""}
            onChange={(e) => handleChange("min_price", e.target.value)}
            placeholder="Min"
            className={
              isDark
                ? "w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                : "w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
            }
          />
          <span className={isDark ? "text-white/30" : "text-gray-400"}>—</span>
          <input
            type="number"
            value={filters.max_price || ""}
            onChange={(e) => handleChange("max_price", e.target.value)}
            placeholder="Max"
            className={
              isDark
                ? "w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                : "w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
            }
          />
        </div>
      </div>

      <div>
        <label className={isDark ? "text-white/60 text-sm mb-2 block" : "text-gray-600 text-sm mb-2 block"}>Voyageurs</label>
        <input
          type="number"
          value={filters.guests || ""}
          onChange={(e) => handleChange("guests", e.target.value)}
          placeholder="Nombre de voyageurs"
          min="1"
          className={
            isDark
              ? "w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              : "w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
          }
        />
      </div>
    </div>
  );
};

export default FilterSidebar;