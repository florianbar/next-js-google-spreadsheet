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

export interface OrganizedMeals {
  date: string;
  meals: Meal[][];
}
