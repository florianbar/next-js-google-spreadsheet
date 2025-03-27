import { Meal } from "../../types/meals";

export interface AddMealBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
