export type Meal = {
  id: string;
  food: string;
  quantity: string;
  healthy: boolean;
  createdAt: string;
};

export type MealUI = Meal & {
  pending: boolean;
};
