import { Meal } from "../../types/meals";

interface MealStoreProperties {
  meals: Meal[];
  pendingMeals: Meal[];
  loading: boolean;
  error: string | null;
}

interface MealStoreActions {
  actions: {
    fetchMeals: (props?: {
      onSuccess?: () => void;
      onFinally?: () => void;
    }) => void;
    addMeals: (newMeals: Meal[]) => void;
  };
}

export interface MealStoreState extends MealStoreProperties, MealStoreActions {}
