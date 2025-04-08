import { create } from "zustand";

import { MealUI } from "../../types/meals";
import { MealStoreState, ActionProps } from "./types";
import { api } from "./api";

const initialState = {
  selectedDate: null,
  meals: [],
  pendingMeals: [],
  foods: [],
  loading: false,
  error: null,
};

const useMealsStore = create<MealStoreState>((set, get) => ({
  ...initialState,

  actions: {
    fetchMeals: async (date, props: ActionProps) => {
      props?.onStart?.();

      set({ selectedDate: date, loading: true });

      try {
        const meals = await api.fetchMeals(date);
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

    prevDay: () => {
      const date = new Date(get().selectedDate);
      date.setDate(date.getDate() - 1);
      const dateString = date.toISOString().split("T")[0];

      set({ selectedDate: dateString });
      get().actions.fetchMeals(dateString);
    },

    nextDay: () => {
      const date = new Date(get().selectedDate);
      date.setDate(date.getDate() + 1);
      const dateString = date.toISOString().split("T")[0];

      set({ selectedDate: dateString });
      get().actions.fetchMeals(dateString);
    },

    addMeals: async (newMeals: MealUI[], props: ActionProps) => {
      props?.onStart?.();

      // optimistic update
      set((state) => ({
        pendingMeals: [...state.pendingMeals, ...newMeals],
      }));

      try {
        const mappedMeals = newMeals.map((meal: MealUI) => ({
          food_id: meal.food.id,
          quantity: meal.quantity,
        }));
        await api.addMeals(mappedMeals);
        props?.onSuccess?.();

        // fetch meals again to get the latest data
        get().actions.fetchMeals(get().selectedDate, {
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

    removeMeal: async (id: string, props: ActionProps) => {
      props?.onStart?.();

      set({ loading: true });

      try {
        await api.removeMeal(id);

        props?.onSuccess?.();

        get().actions.fetchMeals(get().selectedDate);
      } catch (error) {
        set({ error: error.message });
        console.error(error);
        props?.onError?.(error.message);
      } finally {
        set({ loading: false });
        props?.onFinally?.();
      }
    },

    fetchFoods: async (props: ActionProps) => {
      props?.onStart?.();

      set({ loading: true });

      try {
        const foods = await api.fetchFoods();
        set({ foods });
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
  },
}));

export default useMealsStore;
