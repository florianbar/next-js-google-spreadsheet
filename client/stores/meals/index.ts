import { create } from "zustand";

import { MealUI } from "../../types/meals";
import { MealStoreState, ActionProps } from "./types";
import { api } from "./api";

const initialState = {
  meals: [],
  pendingMeals: [],
  foods: [],
  loading: false,
  error: null,
};

const useMealsStore = create<MealStoreState>((set, get) => ({
  ...initialState,

  actions: {
    fetchMeals: async (props: ActionProps) => {
      props?.onStart?.();

      set({ loading: true });

      try {
        const data = await api.fetchMeals();
        set({ meals: data.meals });
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
        const data = await api.addMeals(mappedMeals);
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

    fetchFoods: async (props: ActionProps) => {
      props?.onStart?.();

      set({ loading: true });

      try {
        const data = await api.fetchFoods();
        set({ foods: data.foods });
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
