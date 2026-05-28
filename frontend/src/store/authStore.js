import { create } from "zustand";

const safeParseJSON = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: safeParseJSON(localStorage.getItem("user")),
  token: localStorage.getItem("token") || null,

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!localStorage.getItem("token"),
}));

export default useAuthStore;