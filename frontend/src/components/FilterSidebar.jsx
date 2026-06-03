const FilterSidebar = ({ filters, onChange }) => {
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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Filtres</h3>
        <button
          onClick={handleReset}
          className="text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      {/* Ville */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">Ville</label>
        <input
          type="text"
          value={filters.city || ""}
          onChange={(e) => handleChange("city", e.target.value)}
          placeholder="Paris, Lyon..."
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      {/* Type de propriété */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">Type</label>
        <select
          value={filters.property_type || ""}
          onChange={(e) => handleChange("property_type", e.target.value)}
          className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
        >
          <option value="">Tous les types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type} className="bg-gray-900">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Prix */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">
          Prix par nuit (€)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.min_price || ""}
            onChange={(e) => handleChange("min_price", e.target.value)}
            placeholder="Min"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
          <span className="text-white/30">—</span>
          <input
            type="number"
            value={filters.max_price || ""}
            onChange={(e) => handleChange("max_price", e.target.value)}
            placeholder="Max"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Voyageurs */}
      <div>
        <label className="text-white/60 text-sm mb-2 block">Voyageurs</label>
        <input
          type="number"
          value={filters.guests || ""}
          onChange={(e) => handleChange("guests", e.target.value)}
          placeholder="Nombre de voyageurs"
          min="1"
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
