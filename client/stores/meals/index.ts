import { create } from "zustand";

import { MealStoreState } from "./types";

const initialState = {
  selectedDate: new Date().toISOString().split("T")[0],
};

const useMealsStore = create<MealStoreState>((set, get) => ({
  ...initialState,

  actions: {
    prevDay: () => {
      const date = new Date(get().selectedDate);
      date.setDate(date.getDate() - 1);
      const dateString = date.toISOString().split("T")[0];

      set({ selectedDate: dateString });
    },

    nextDay: () => {
      const date = new Date(get().selectedDate);
      date.setDate(date.getDate() + 1);
      const dateString = date.toISOString().split("T")[0];

      set({ selectedDate: dateString });
    },
  },
}));

export default useMealsStore;
