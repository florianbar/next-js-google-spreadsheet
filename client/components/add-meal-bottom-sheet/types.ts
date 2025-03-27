export type Meal = {
  createdAt: string;
  food: string;
  quantity: string;
  healthy: boolean;
};

export interface AddMealBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
