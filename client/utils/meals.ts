import { Meal, MealUI, OrganizedMeals } from "../types/meals";

// export function getMappedMeals(meals: Meal[]): Meal[] {
//   return meals.map((meal: Meal) => {
//     const { id, quantity, consumed_at, food } = meal;

//     return {
//       id,
//       quantity,
//       consumedAt: consumed_at,
//       food,
//     };
//   });
// }

export const TIMESLOT_LABLES = {
  breakfast: "Breakfast",
  morningSnack: "Morning Snack",
  lunch: "Lunch",
  afternoonSnack: "Afternoon Snack",
  dinner: "Dinner",
};

export function getMealsByDateAndTime(meals: MealUI[]): OrganizedMeals[] {
  const organizedMeals = [];
  const timeSlots = {
    [TIMESLOT_LABLES.breakfast]: 6,
    [TIMESLOT_LABLES.morningSnack]: 9,
    [TIMESLOT_LABLES.lunch]: 12,
    [TIMESLOT_LABLES.afternoonSnack]: 15,
    [TIMESLOT_LABLES.dinner]: 18,
  };
  const timeslotKeys = Object.values(TIMESLOT_LABLES);

  const mealsByDate = {};

  meals.forEach((meal: MealUI) => {
    const consumedAt = new Date(meal.consumed_at);
    const dateString = consumedAt.toISOString().split("T")[0];
    const hour = consumedAt.getHours();

    let closestSlot = null;
    let minDifference = Infinity;

    for (const slotName of timeslotKeys) {
      const slotHour = timeSlots[slotName];
      const difference = Math.abs(hour - slotHour);

      if (difference < minDifference) {
        minDifference = difference;
        closestSlot = slotName;
      } else if (difference === minDifference) {
        // If the difference is the same, round to the later time slot
        if (Math.abs(hour - timeSlots[closestSlot]) < difference) {
          closestSlot = slotName;
        }
      }
    }

    if (!mealsByDate[dateString]) {
      mealsByDate[dateString] = {
        [timeslotKeys[0]]: [],
        [timeslotKeys[1]]: [],
        [timeslotKeys[2]]: [],
        [timeslotKeys[3]]: [],
        [timeslotKeys[4]]: [],
      };
    }

    mealsByDate[dateString][closestSlot].push(meal);
  });

  for (const date in mealsByDate) {
    organizedMeals.push({
      date: date,
      meals: Object.values(mealsByDate[date]),
    });
  }

  return organizedMeals;
}
