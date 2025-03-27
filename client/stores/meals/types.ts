import { Meal } from "../../types/meals";

interface MealStoreProperties {
  meals: Meal[];
  pendingMeals: Meal[];
  loading: boolean;
  error: string | null;
}

interface ActionProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

interface MealStoreActions {
  actions: {
    fetchMeals: (props?: ActionProps) => void;
    addMeals: (newMeals: Meal[], props?: ActionProps) => void;
  };
}

export interface MealStoreState extends MealStoreProperties, MealStoreActions {}
