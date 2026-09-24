import { create } from "zustand";

export const useTrendingStore = create((set, get) => ({
  trending: [],
  getTrending: async () => {
    if (get().trending && get().trending.length > 0) return;
    try {
      const response = await fetch("/foods.json");
      const data = await response.json();
      set({ trending: data?.hits || [] });
    } catch (error) {
      console.error("Failed to fetch trending foods:", error);
    }
  },
}));
