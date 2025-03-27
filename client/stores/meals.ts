import { API_URL } from "@env";
import { create } from "zustand";
import { Alert } from "react-native";

import { Meal } from "../types/meals";
import { getMappedMeals } from "../utils/meals";

interface MealStoreState {
  meals: Meal[];
  pendingMeals: Meal[];
  loading: boolean;
  fetchMeals: (onSuccess?: () => void) => void;
  addMeals: (newMeals: Meal[]) => void;
}

const useMealsStore = create<MealStoreState>((set, get) => ({
  meals: [],
  loading: false,
  pendingMeals: [],

  fetchMeals: (onSuccess) => {
    set({ loading: true });

    // fetch meals from the API
    fetch(`${API_URL}/api/meals`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch meals.");
        }
        return response.json();
      })
      .then((data) => {
        const cleanData = data.values.slice(1); // remove title row
        const meals = getMappedMeals(cleanData);

        onSuccess && onSuccess();
        set({ meals });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        set({ loading: false });
      });
  },

  addMeals: (newMeals: Meal[]) => {
    // optimistic update
    set((state) => ({
      pendingMeals: [...state.pendingMeals, ...newMeals],
    }));

    // persist the data
    fetch(`${API_URL}/api/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meals: newMeals,
      }),
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("Failed to add meal/s.");
        }
        return response.json();
      })
      .then((data: any) => {
        Alert.alert(
          "Meal/s Added",
          "The meal/s have been added successfully.",
          [{ text: "OK", onPress: () => {} }]
        );

        // fetch meals again to get the latest data
        get().fetchMeals(() => {
          // remove the meals from pending meals
          set((state) => ({
            pendingMeals: state.pendingMeals.filter(
              (meal) => !newMeals.some((newMeal) => newMeal.food === meal.food)
            ),
          }));
        });
      })
      .catch((error: Error) => {
        Alert.alert("Failed to Add Meal/s", "An error occurred.", [
          { text: "OK", onPress: () => {} },
        ]);
      });
  },
}));

export default useMealsStore;
