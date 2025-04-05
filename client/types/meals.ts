export type Meal = {
  id: string;
  quantity: string;
  consumed_at: string;
  food: {
    id: string;
    name: string;
    healthy: boolean;
  };
};

export type MealUI = Meal & {
  pending: boolean;
};

export interface OrganizedMeals {
  date: string;
  meals: MealUI[][];
}
