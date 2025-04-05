import { Meal, MealUI } from "../../types/meals";
import { Food } from "../../types/foods";

interface MealStoreProperties {
  meals: Meal[];
  pendingMeals: MealUI[];
  foods: Food[];
  loading: boolean;
  error: string | null;
}

export interface ActionProps {
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

interface MealStoreActions {
  actions: {
    fetchMeals: (props?: ActionProps) => void;
    addMeals: (newMeals: MealUI[], props?: ActionProps) => void;
    fetchFoods: (props?: ActionProps) => void;
  };
}

export interface MealStoreState extends MealStoreProperties, MealStoreActions {}
