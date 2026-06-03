import { useState } from "react";
import useThemeStore from "../store/themeStore";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-2xl mx-auto">
      <div className="flex-1 relative">
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${
            isDark ? "text-white/40" : "text-gray-400"
          }`}
        >
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une ville, un pays..."
          className={`w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-violet-500 transition-colors ${
            isDark
              ? "bg-white/10 border border-white/20 text-white placeholder-white/30"
              : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
          }`}
        />
      </div>
      <button
        type="submit"
        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap"
      >
        Rechercher
      </button>
    </form>
  );
};

export default SearchBar;