import { create } from "zustand";

export const useTrendingStore = create((set) => ({
  trending: [],
  getTrending: async () => {
    try {
      const response = await fetch("http://localhost:3000/foods.json");
      const data = await response.json();
      set({ trending: data?.hits });
    } catch (error) {
      console.error("Failed to fetch trending foods:", error);
    }
  },
}));
