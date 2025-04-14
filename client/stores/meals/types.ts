interface MealStoreProperties {
  selectedDate: string | null;
}

interface MealStoreActions {
  actions: {
    prevDay: () => void;
    nextDay: () => void;
  };
}

export interface MealStoreState extends MealStoreProperties, MealStoreActions {}
