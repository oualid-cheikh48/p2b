import { create } from "zustand";

const root = document.documentElement;
const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

// applique le thème au chargement
root.setAttribute("data-theme", savedTheme);

const useThemeStore = create((set) => ({
  theme: savedTheme,

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";

      localStorage.setItem("theme", newTheme);
      root.setAttribute("data-theme", newTheme);

      return { theme: newTheme };
    }),
}));

export default useThemeStore;