import { Meal } from "../../types/meals";

export interface AddMealBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (meals: Meal[]) => void;
}
