import { create } from "zustand";

import { Meal } from "../../types/meals";
import { getMappedMeals } from "../../utils/meals";
import { MealStoreState } from "./types";
import { api } from "./api";

const initialState = {
  meals: [],
  pendingMeals: [],
  loading: false,
  error: null,
};

const useMealsStore = create<MealStoreState>((set, get) => ({
  ...initialState,

  actions: {
    fetchMeals: async (props) => {
      set({ loading: true });

      try {
        const data = await api.fetchMeals();
        const meals = getMappedMeals(data.values.slice(1));
        set({ meals });
        props?.onSuccess?.();
      } catch (error) {
        set({ error: error.message });
        console.error(error);
        props?.onError?.(error.message);
      } finally {
        set({ loading: false });
        props?.onFinally?.();
      }
    },

    addMeals: async (newMeals: Meal[], props) => {
      // optimistic update
      set((state) => ({
        pendingMeals: [...state.pendingMeals, ...newMeals],
      }));

      try {
        const data = await api.addMeals(newMeals);
        props?.onSuccess?.();

        // fetch meals again to get the latest data
        get().actions.fetchMeals({
          onFinally: () => {
            // remove the meals from pending meals
            set((state) => ({
              pendingMeals: state.pendingMeals.filter(
                (meal) =>
                  !newMeals.some((newMeal) => newMeal.food === meal.food)
              ),
            }));
          },
        });
      } catch (error) {
        set({ error: error.message });
        console.error(error);
        props?.onError?.(error.message);
      } finally {
        // set({ loading: false });
        props?.onFinally?.();
      }
    },
  },
}));

export default useMealsStore;
